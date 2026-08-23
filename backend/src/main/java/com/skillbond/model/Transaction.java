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
@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;

    private String userId;

    private String type; // "INVESTMENT_DISBURSEMENT", "REPAYMENT_COLLECTION", "FEE", "REFUND"

    private Double amount;

    private String referenceId; // Investment or Repayment ID

    private String paymentMethod;

    @Builder.Default
    private String status = "SUCCESS"; // "SUCCESS", "PENDING", "FAILED"

    private String description;

    @CreatedDate
    private Instant createdAt;
}
