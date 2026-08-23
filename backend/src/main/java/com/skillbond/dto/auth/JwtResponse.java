package com.skillbond.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {
    private String token;
    private String refreshToken;
    @Builder.Default
    private String type = "Bearer";
    private String id;
    private String email;
    private String fullName;
    private List<String> roles;
}
