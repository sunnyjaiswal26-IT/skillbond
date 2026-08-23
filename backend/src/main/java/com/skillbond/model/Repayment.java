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
@Document(collection = "repayments")
public class Repayment {

    @Id
    private String id;

    private String investmentId;

    private String studentUserId;

    private String investorUserId;

    private Double monthlySalary;

    private Double calculatedAmount;

    private Double paidAmount;

    private Instant dueDate;

    private Instant paidDate;

    @Builder.Default
    private String status = "PENDING"; // "PENDING", "PAID", "OVERDUE"

    private String transactionId;

    @CreatedDate
    private Instant createdAt;
}
