package com.skillbond.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "investments")
public class Investment {

    @Id
    private String id;

    private String fundingRequestId;

    private String investorId;

    private String investorUserId;

    private String studentId;

    private String studentUserId;

    private String studentName;

    private Double amount;

    private Double isaPercentage;

    private Integer durationMonths;

    @Builder.Default
    private Double totalRepaid = 0.0;

    @Builder.Default
    private String status = "ACTIVE"; // "ACTIVE", "COMPLETED", "DEFAULTED"

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
