package com.skillbond.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "investors")
public class Investor {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private String organizationName;

    private String investorType; // e.g. "INDIVIDUAL", "ANGEL", "VNC", "CORPORATE"

    private Double totalCapitalBudget; // In Indian Rupees (₹)

    private Double totalCapitalInvested; // In Indian Rupees (₹)

    @Builder.Default
    private Double expectedMinReturnRate = 8.0;

    private String bio;

    private String website;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
