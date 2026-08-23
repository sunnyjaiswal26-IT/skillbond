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
@Document(collection = "funding_requests")
public class FundingRequest {

    @Id
    private String id;

    private String studentId;

    private String userId;

    private String studentName;

    private Double requestedAmount; // In Indian Rupees (₹)

    private Double isaPercentage; // Percentage of future income shared

    private Integer durationMonths; // Duration of sharing income after job placement

    private String reason;

    // Academic Context for Investor Review
    private String collegeName;

    private String universityName;

    private String degree;

    private String branch;

    private String currentYear;

    private Double currentCgpa;

    private Double mhtCetPercentile;

    private Double jeeMainPercentile;

    private Double tenthPercentage;

    private Double twelfthPercentage;

    private Double collegeAveragePackage; // In Indian Rupees (₹)

    private Integer expectedGraduationYear;

    @Builder.Default
    private String status = "PENDING"; // "PENDING", "APPROVED", "FUNDED", "REJECTED", "CANCELLED"

    private String adminNotes;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
