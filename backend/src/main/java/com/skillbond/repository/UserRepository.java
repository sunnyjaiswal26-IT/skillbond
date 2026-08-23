package com.skillbond.repository;

import com.skillbond.model.Role;
import com.skillbond.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    Optional<User> findByRefreshToken(String refreshToken);

    Optional<User> findByVerificationToken(String verificationToken);

    Optional<User> findByResetPasswordToken(String resetPasswordToken);

    List<User> findByRolesContains(Role role);
}
