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
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "students")
public class Student {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    // Academic & Institution Details (Maharashtra Engineering Focus)
    private String collegeName; // e.g. "COEP Technological University, Pune", "VJTI, Mumbai", "PICT, Pune"

    private String universityName; // e.g. "Savitribai Phule Pune University (SPPU)", "Mumbai University", "Autonomous"

    private String degree; // e.g. "B.Tech", "B.E."

    private String branch; // e.g. "Computer Engineering", "Information Technology", "AI & Data Science", "EXTC"

    private String currentYear; // e.g. "First Year (FE)", "Second Year (SE)", "Third Year (TE)", "Final Year (BE/B.Tech)"

    private Integer expectedGraduationYear;

    // Entrance Exams & Academic Percentage Scores
    private Double tenthPercentage; // 10th Board %

    private Double twelfthPercentage; // 12th Board / Diploma %

    private Double mhtCetPercentile; // MHT-CET Percentile Score

    private Double jeeMainPercentile; // JEE Main Percentile Score

    private Double jeeAdvancedPercentile; // JEE Advanced Percentile Score (Optional)

    private Double currentCgpa; // Current CGPA till date (out of 10)

    // Placement & Financial Metrics in Indian Rupees (₹)
    private Double collegeAveragePackage; // Average Placement Package of College (in ₹ per annum)

    private Double currentSalary; // Current Salary if placed/internship (in ₹ per annum)

    private Double expectedSalary; // Expected Salary Post-Graduation (in ₹ per annum)

    private String placementStatus; // e.g. "STUDYING", "INTERNSHIP", "PLACED", "SEARCHING"

    private String bio;

    @Builder.Default
    private List<String> skills = new ArrayList<>();

    @Builder.Default
    private List<Project> projects = new ArrayList<>();

    private String resumeUrl;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Project {
        private String title;
        private String description;
        private String githubUrl;
        private String liveUrl;
    }
}
