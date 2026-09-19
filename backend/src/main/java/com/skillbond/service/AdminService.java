package com.skillbond.service;

import com.skillbond.model.*;
import com.skillbond.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final InvestorRepository investorRepository;
    private final FundingRequestRepository fundingRequestRepository;
    private final InvestmentRepository investmentRepository;
    private final TransactionRepository transactionRepository;
    private final AuditLogRepository auditLogRepository;
    private final SystemSettingsRepository systemSettingsRepository;
    private final AiRiskScoringService aiRiskScoringService;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User toggleUserStatus(String userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setEnabled(enabled);
        userRepository.save(user);

        auditLogRepository.save(AuditLog.builder()
                .userId(user.getId())
                .userEmail(user.getEmail())
                .action(enabled ? "USER_UNBLOCKED" : "USER_BLOCKED")
                .details("Admin updated user active status to: " + enabled)
                .build());

        return user;
    }

    public User approveUserAccount(String userId, boolean approved) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setApproved(approved);
        userRepository.save(user);

        auditLogRepository.save(AuditLog.builder()
                .userId(user.getId())
                .userEmail(user.getEmail())
                .action(approved ? "USER_APPROVED" : "USER_REJECTED")
                .details("Admin updated user approval status to: " + approved)
                .build());

        return user;
    }

    public List<FundingRequest> getAllFundingRequests() {
        List<FundingRequest> requests = fundingRequestRepository.findAll();
        for (FundingRequest req : requests) {
            if (req.getAiRiskScore() == null) {
                aiRiskScoringService.evaluateAndScoreRequest(req);
                fundingRequestRepository.save(req);
            }
        }
        return requests;
    }

    public FundingRequest updateFundingRequestStatus(String requestId, String status, String adminNotes) {
        FundingRequest request = fundingRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Funding request not found"));
        request.setStatus(status);
        if (adminNotes != null) request.setAdminNotes(adminNotes);

        auditLogRepository.save(AuditLog.builder()
                .userId(request.getUserId())
                .userEmail(request.getStudentName())
                .action("FUNDING_REQUEST_" + status)
                .details("Admin updated ISA proposal #" + requestId + " to status: " + status)
                .build());

        return fundingRequestRepository.save(request);
    }

    public FundingRequest recalculateAiRiskScore(String requestId) {
        FundingRequest request = fundingRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Funding request not found"));
        aiRiskScoringService.evaluateAndScoreRequest(request);
        return fundingRequestRepository.save(request);
    }

    public Map<String, Object> getPlatformAnalytics() {
        long totalUsers = userRepository.count();
        long totalStudents = studentRepository.count();
        long totalInvestors = investorRepository.count();
        long totalFundingRequests = fundingRequestRepository.count();
        long pendingRequests = fundingRequestRepository.findByStatus("PENDING").size();
        long totalInvestments = investmentRepository.count();
        
        double totalVolume = investmentRepository.findAll().stream()
                .mapToDouble(Investment::getAmount).sum();

        return Map.of(
                "totalUsers", totalUsers,
                "totalStudents", totalStudents,
                "totalInvestors", totalInvestors,
                "totalFundingRequests", totalFundingRequests,
                "pendingRequests", pendingRequests,
                "totalInvestments", totalInvestments,
                "totalVolume", totalVolume
        );
    }

    public SystemSettings getSystemSettings() {
        return systemSettingsRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> systemSettingsRepository.save(new SystemSettings()));
    }

    public SystemSettings updateSystemSettings(SystemSettings newSettings) {
        SystemSettings settings = getSystemSettings();
        if (newSettings.getMinIsaPercentage() != null) settings.setMinIsaPercentage(newSettings.getMinIsaPercentage());
        if (newSettings.getMaxIsaPercentage() != null) settings.setMaxIsaPercentage(newSettings.getMaxIsaPercentage());
        if (newSettings.getMinSalaryFloorThreshold() != null) settings.setMinSalaryFloorThreshold(newSettings.getMinSalaryFloorThreshold());
        if (newSettings.getMaxRepaymentCapMultiplier() != null) settings.setMaxRepaymentCapMultiplier(newSettings.getMaxRepaymentCapMultiplier());
        if (newSettings.getPlatformFeePercentage() != null) settings.setPlatformFeePercentage(newSettings.getPlatformFeePercentage());
        settings.setAutomaticStudentApprovalEnabled(newSettings.isAutomaticStudentApprovalEnabled());
        settings.setMaintenanceMode(newSettings.isMaintenanceMode());

        auditLogRepository.save(AuditLog.builder()
                .action("SYSTEM_SETTINGS_UPDATED")
                .details("Admin updated global platform ISA thresholds and configuration.")
                .build());

        return systemSettingsRepository.save(settings);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc();
    }
}
