package com.skillbond.service;

import com.skillbond.model.*;
import com.skillbond.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvestorService {

    private final InvestorRepository investorRepository;
    private final StudentRepository studentRepository;
    private final FundingRequestRepository fundingRequestRepository;
    private final InvestmentRepository investmentRepository;
    private final TransactionRepository transactionRepository;

    public Investor getInvestorByUserId(String userId) {
        return investorRepository.findByUserId(userId)
                .orElseGet(() -> investorRepository.save(Investor.builder()
                        .userId(userId)
                        .totalCapitalBudget(50000.0)
                        .totalCapitalInvested(0.0)
                        .build()));
    }

    public Investor updateInvestorProfile(String userId, Investor updatedData) {
        Investor investor = getInvestorByUserId(userId);
        if (updatedData.getOrganizationName() != null) investor.setOrganizationName(updatedData.getOrganizationName());
        if (updatedData.getInvestorType() != null) investor.setInvestorType(updatedData.getInvestorType());
        if (updatedData.getTotalCapitalBudget() != null) investor.setTotalCapitalBudget(updatedData.getTotalCapitalBudget());
        if (updatedData.getExpectedMinReturnRate() != null) investor.setExpectedMinReturnRate(updatedData.getExpectedMinReturnRate());
        if (updatedData.getBio() != null) investor.setBio(updatedData.getBio());
        if (updatedData.getWebsite() != null) investor.setWebsite(updatedData.getWebsite());

        return investorRepository.save(investor);
    }

    public List<Student> browseStudents() {
        return studentRepository.findAll();
    }

    public List<FundingRequest> getAllPendingFundingRequests() {
        return fundingRequestRepository.findByStatus("APPROVED"); // Approved by admin, open for funding
    }

    public Investment fundStudentRequest(String investorUserId, String fundingRequestId) {
        Investor investor = getInvestorByUserId(investorUserId);
        FundingRequest fundingRequest = fundingRequestRepository.findById(fundingRequestId)
                .orElseThrow(() -> new IllegalArgumentException("Funding request not found"));

        if (!"APPROVED".equals(fundingRequest.getStatus()) && !"PENDING".equals(fundingRequest.getStatus())) {
            throw new IllegalArgumentException("Funding request is not eligible for investment");
        }

        Investment investment = Investment.builder()
                .fundingRequestId(fundingRequest.getId())
                .investorId(investor.getId())
                .investorUserId(investorUserId)
                .studentId(fundingRequest.getStudentId())
                .studentUserId(fundingRequest.getUserId())
                .studentName(fundingRequest.getStudentName())
                .amount(fundingRequest.getRequestedAmount())
                .isaPercentage(fundingRequest.getIsaPercentage())
                .durationMonths(fundingRequest.getDurationMonths())
                .status("ACTIVE")
                .totalRepaid(0.0)
                .build();

        Investment savedInvestment = investmentRepository.save(investment);

        // Update funding request status
        fundingRequest.setStatus("FUNDED");
        fundingRequestRepository.save(fundingRequest);

        // Update investor stats
        investor.setTotalCapitalInvested(investor.getTotalCapitalInvested() + fundingRequest.getRequestedAmount());
        investorRepository.save(investor);

        // Record transaction
        Transaction transaction = Transaction.builder()
                .userId(investorUserId)
                .type("INVESTMENT_DISBURSEMENT")
                .amount(fundingRequest.getRequestedAmount())
                .referenceId(savedInvestment.getId())
                .paymentMethod("BANK_TRANSFER")
                .status("SUCCESS")
                .description("Disbursement for student ISA: " + fundingRequest.getStudentName())
                .build();
        transactionRepository.save(transaction);

        return savedInvestment;
    }

    public List<Investment> getPortfolio(String investorUserId) {
        return investmentRepository.findByInvestorUserId(investorUserId);
    }

    public Map<String, Object> getRoiAnalytics(String investorUserId) {
        List<Investment> investments = getPortfolio(investorUserId);
        double totalInvested = investments.stream().mapToDouble(Investment::getAmount).sum();
        double totalRepaid = investments.stream().mapToDouble(Investment::getTotalRepaid).sum();
        double netRoi = totalInvested > 0 ? ((totalRepaid - totalInvested) / totalInvested) * 100 : 0.0;

        return Map.of(
                "totalInvestments", investments.size(),
                "totalInvested", totalInvested,
                "totalRepaid", totalRepaid,
                "netRoiPercentage", netRoi,
                "activeContracts", investments.stream().filter(i -> "ACTIVE".equals(i.getStatus())).count()
        );
    }
}
