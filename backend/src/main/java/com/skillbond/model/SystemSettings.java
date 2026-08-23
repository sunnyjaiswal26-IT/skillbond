package com.skillbond.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "system_settings")
public class SystemSettings {

    @Id
    private String id;

    @Builder.Default
    private Double minIsaPercentage = 4.0;

    @Builder.Default
    private Double maxIsaPercentage = 15.0;

    @Builder.Default
    private Double minSalaryFloorThreshold = 400000.0; // ₹ 4,00,000 per annum (₹ 4 LPA)

    @Builder.Default
    private Double maxRepaymentCapMultiplier = 1.6;

    @Builder.Default
    private Double platformFeePercentage = 1.5;

    @Builder.Default
    private boolean automaticStudentApprovalEnabled = false;

    @Builder.Default
    private boolean maintenanceMode = false;
}
