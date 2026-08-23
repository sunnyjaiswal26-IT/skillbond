package com.skillbond.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "audit_logs")
public class AuditLog {

    @Id
    private String id;

    private String userId;

    private String userEmail;

    private String action; // e.g. "USER_LOGIN", "FUNDING_REQUEST_CREATED", "INVESTMENT_MADE", "USER_BLOCKED"

    private String details;

    private String ipAddress;

    @CreatedDate
    private Instant createdAt;
}
