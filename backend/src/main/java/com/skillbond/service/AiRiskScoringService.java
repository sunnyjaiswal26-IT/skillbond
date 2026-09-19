package com.skillbond.service;

import com.skillbond.model.FundingRequest;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AiRiskScoringService {

    /**
     * Evaluates a funding request dynamically based on entrance scores, CGPA,
     * 10th/12th marks, college reputation, branch, average placement CTC, and ISA loan ratio.
     */
    public FundingRequest evaluateAndScoreRequest(FundingRequest request) {
        if (request == null) return null;

        double entranceScore = calculateEntranceScore(request.getMhtCetPercentile(), request.getJeeMainPercentile());
        double academicScore = calculateAcademicScore(request.getCurrentCgpa(), request.getTenthPercentage(), request.getTwelfthPercentage());
        double institutionScore = calculateInstitutionScore(request.getCollegeName(), request.getCollegeAveragePackage());
        double branchScore = calculateBranchScore(request.getBranch());
        double financialFeasibilityScore = calculateFinancialFeasibilityScore(request.getRequestedAmount(), request.getIsaPercentage(), request.getCollegeAveragePackage());

        // Multi-Factor Weighted Calculation
        double rawScore = (entranceScore * 0.30) +
                           (academicScore * 0.25) +
                           (institutionScore * 0.20) +
                           (branchScore * 0.15) +
                           (financialFeasibilityScore * 0.10);

        int finalScore = (int) Math.min(99, Math.max(30, Math.round(rawScore)));
        request.setAiRiskScore(finalScore);

        // Risk Category Assignment
        if (finalScore >= 80) {
            request.setAiRiskCategory("LOW_RISK");
            request.setAiApprovalRecommendation("HIGHLY_RECOMMENDED");
        } else if (finalScore >= 60) {
            request.setAiRiskCategory("MODERATE_RISK");
            request.setAiApprovalRecommendation("RECOMMENDED_WITH_TERMS");
        } else {
            request.setAiRiskCategory("HIGH_RISK");
            request.setAiApprovalRecommendation("REQUIRES_MANUAL_REVIEW");
        }

        // Dynamic Projected Annual Investor Return % based on candidate risk profile
        double projectedRoi = 10.0 + ((finalScore - 40) * 0.09);
        request.setAiProjectedRoi(Math.round(projectedRoi * 10.0) / 10.0);

        // Generate tailored natural language AI Candidate Summary
        String summary = generateAnalysisSummary(request, finalScore, entranceScore, academicScore, institutionScore);
        request.setAiAnalysisSummary(summary);

        return request;
    }

    private double calculateEntranceScore(Double cet, Double jee) {
        double topPercentile = 0.0;
        boolean hasCet = (cet != null && cet > 0);
        boolean hasJee = (jee != null && jee > 0);

        if (hasCet) topPercentile = Math.max(topPercentile, cet);
        if (hasJee) topPercentile = Math.max(topPercentile, jee);

        if (!hasCet && !hasJee) {
            return 70.0; // Baseline if no entrance exam provided
        }

        // Direct mapping of entrance percentile to 0-100 score
        if (topPercentile >= 99.0) return 98.0 + (topPercentile - 99.0) * 2;
        if (topPercentile >= 95.0) return 90.0 + (topPercentile - 95.0) * 2;
        if (topPercentile >= 90.0) return 80.0 + (topPercentile - 90.0) * 2;
        if (topPercentile >= 80.0) return 70.0 + (topPercentile - 80.0);
        return Math.max(40.0, topPercentile);
    }

    private double calculateAcademicScore(Double cgpa, Double tenth, Double twelfth) {
        double cgpaScore = (cgpa != null && cgpa > 0) ? (cgpa / 10.0) * 100.0 : 75.0;
        double tenthScore = (tenth != null && tenth > 0) ? tenth : 75.0;
        double twelfthScore = (twelfth != null && twelfth > 0) ? twelfth : 75.0;

        return (cgpaScore * 0.60) + (tenthScore * 0.20) + (twelfthScore * 0.20);
    }

    private double calculateInstitutionScore(String collegeName, Double avgPackage) {
        double score = 70.0;
        if (collegeName != null) {
            String lower = collegeName.toLowerCase(Locale.ROOT);
            if (lower.contains("coep") || lower.contains("vjti") || lower.contains("vnit")) {
                score = 98.0;
            } else if (lower.contains("pict") || lower.contains("spit") || lower.contains("djsce") || lower.contains("vit")) {
                score = 92.0;
            } else if (lower.contains("wce") || lower.contains("mit") || lower.contains("cummins") || lower.contains("ramdeobaba")) {
                score = 85.0;
            } else if (lower.contains("karad") || lower.contains("aurangabad")) {
                score = 80.0;
            }
        }
        if (avgPackage != null) {
            if (avgPackage >= 1400000.0) score = Math.max(score, 96.0);
            else if (avgPackage >= 1000000.0) score = Math.max(score, 90.0);
            else if (avgPackage >= 600000.0) score = Math.max(score, 80.0);
        }
        return score;
    }

    private double calculateBranchScore(String branch) {
        if (branch == null) return 75.0;
        String lower = branch.toLowerCase(Locale.ROOT);
        if (lower.contains("computer") || lower.contains("information") || lower.contains("ai") || lower.contains("data")) {
            return 96.0;
        } else if (lower.contains("extc") || lower.contains("electronics") || lower.contains("electrical")) {
            return 86.0;
        } else if (lower.contains("mechanical") || lower.contains("robotics") || lower.contains("instrumentation")) {
            return 78.0;
        } else if (lower.contains("civil")) {
            return 72.0;
        }
        return 75.0;
    }

    private double calculateFinancialFeasibilityScore(Double requestedAmount, Double isaPercentage, Double avgPackage) {
        if (requestedAmount == null || requestedAmount <= 0) return 80.0;
        double packageAmt = (avgPackage != null && avgPackage > 0) ? avgPackage : 800000.0;

        // Ratio of requested ISA capital vs expected annual placement salary
        double ratio = requestedAmount / packageAmt;
        if (ratio <= 0.15) return 98.0;
        if (ratio <= 0.25) return 90.0;
        if (ratio <= 0.40) return 80.0;
        if (ratio <= 0.60) return 65.0;
        return 50.0;
    }

    private String generateAnalysisSummary(FundingRequest req, int finalScore, double entranceScore, double academicScore, double institutionScore) {
        StringBuilder sb = new StringBuilder();
        sb.append("AI Candidate Evaluation (Dynamic Score: ").append(finalScore).append("/100): ");

        if (req.getStudentName() != null) {
            sb.append(req.getStudentName());
        } else {
            sb.append("Student");
        }

        if (req.getCollegeName() != null) {
            sb.append(" is enrolled in ").append(req.getBranch() != null ? req.getBranch() : "Engineering")
              .append(" at ").append(req.getCollegeName()).append(". ");
        }

        if (req.getMhtCetPercentile() != null && req.getMhtCetPercentile() > 0) {
            sb.append("MHT-CET Score: ").append(req.getMhtCetPercentile()).append("%ile. ");
        } else if (req.getJeeMainPercentile() != null && req.getJeeMainPercentile() > 0) {
            sb.append("JEE Main Score: ").append(req.getJeeMainPercentile()).append("%ile. ");
        }

        if (req.getCurrentCgpa() != null && req.getCurrentCgpa() > 0) {
            sb.append("Current CGPA: ").append(req.getCurrentCgpa()).append("/10. ");
        }

        if (finalScore >= 80) {
            sb.append("High placement probability with low ISA credit default risk.");
        } else if (finalScore >= 60) {
            sb.append("Moderate placement probability with standard ISA terms.");
        } else {
            sb.append("Requires manual admin review due to higher risk parameters.");
        }

        return sb.toString();
    }
}
