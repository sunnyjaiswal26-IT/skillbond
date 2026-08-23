package com.skillbond.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private String id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String profilePictureUrl;
    private Set<String> roles;
    private boolean enabled;
    private boolean verified;
    private boolean approved;
    private Instant createdAt;
}
