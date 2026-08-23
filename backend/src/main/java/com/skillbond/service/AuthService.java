package com.skillbond.service;

import com.skillbond.dto.auth.*;
import com.skillbond.model.Role;
import com.skillbond.model.User;
import com.skillbond.repository.UserRepository;
import com.skillbond.security.jwt.JwtUtils;
import com.skillbond.security.services.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Value("${skillbond.app.jwtRefreshExpirationMs}")
    private Long refreshTokenDurationMs;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String refreshToken = createRefreshToken(user);

        return JwtResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken)
                .id(userDetails.getId())
                .email(userDetails.getEmail())
                .fullName(userDetails.getFullName())
                .roles(roles)
                .build();
    }

    public MessageResponse registerUser(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        HashSet<Role> roles = new HashSet<>();
        String reqRole = signupRequest.getRole() != null ? signupRequest.getRole().toUpperCase() : "STUDENT";
        
        if ("ADMIN".equals(reqRole) || "ROLE_ADMIN".equals(reqRole)) {
            throw new IllegalArgumentException("Registration for Admin role is strictly prohibited. Admin accounts are system-provisioned only.");
        }

        switch (reqRole) {
            case "INVESTOR":
                roles.add(Role.ROLE_INVESTOR);
                break;
            default:
                roles.add(Role.ROLE_STUDENT);
                break;
        }

        User user = User.builder()
                .fullName(signupRequest.getFullName())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .phoneNumber(signupRequest.getPhoneNumber())
                .roles(roles)
                .enabled(true)
                .verified(true)
                .approved(true)
                .verificationToken(UUID.randomUUID().toString())
                .build();

        userRepository.save(user);

        return new MessageResponse("User registered successfully!");
    }

    public TokenRefreshResponse refreshToken(RefreshTokenRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return userRepository.findByRefreshToken(requestRefreshToken)
                .map(this::verifyExpiration)
                .map(user -> {
                    String token = jwtUtils.generateTokenFromUsername(user.getEmail());
                    return TokenRefreshResponse.builder()
                            .accessToken(token)
                            .refreshToken(user.getRefreshToken())
                            .build();
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("No user found with email: " + request.getEmail()));

        String resetToken = UUID.randomUUID().toString();
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordTokenExpiry(Instant.now().plusSeconds(3600)); // 1 hour
        userRepository.save(user);

        return new MessageResponse("Reset token generated: " + resetToken);
    }

    public MessageResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid password reset token"));

        if (user.getResetPasswordTokenExpiry() == null || user.getResetPasswordTokenExpiry().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Password reset token expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);

        return new MessageResponse("Password reset successful!");
    }

    public MessageResponse logout(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRefreshToken(null);
        user.setRefreshTokenExpiry(null);
        userRepository.save(user);
        return new MessageResponse("Logged out successfully");
    }

    private String createRefreshToken(User user) {
        user.setRefreshToken(UUID.randomUUID().toString());
        user.setRefreshTokenExpiry(Instant.now().plusMillis(refreshTokenDurationMs));
        userRepository.save(user);
        return user.getRefreshToken();
    }

    private User verifyExpiration(User user) {
        if (user.getRefreshTokenExpiry().compareTo(Instant.now()) < 0) {
            user.setRefreshToken(null);
            user.setRefreshTokenExpiry(null);
            userRepository.save(user);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return user;
    }
}
