package com.skillbond.controller;

import com.skillbond.model.FundingRequest;
import com.skillbond.model.Investment;
import com.skillbond.model.Investor;
import com.skillbond.model.Student;
import com.skillbond.security.services.UserDetailsImpl;
import com.skillbond.service.InvestorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/investor")
@RequiredArgsConstructor
public class InvestorController {

    private final InvestorService investorService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('INVESTOR') or hasRole('ADMIN')")
    public ResponseEntity<Investor> getProfile(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(investorService.getInvestorByUserId(userDetails.getId()));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('INVESTOR') or hasRole('ADMIN')")
    public ResponseEntity<Investor> updateProfile(Authentication authentication, @RequestBody Investor investor) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(investorService.updateInvestorProfile(userDetails.getId(), investor));
    }

    @GetMapping("/students")
    @PreAuthorize("hasRole('INVESTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Student>> browseStudents() {
        return ResponseEntity.ok(investorService.browseStudents());
    }

    @GetMapping("/funding-requests")
    @PreAuthorize("hasRole('INVESTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<FundingRequest>> getFundingRequests() {
        return ResponseEntity.ok(investorService.getAllPendingFundingRequests());
    }

    @PostMapping("/fund/{requestId}")
    @PreAuthorize("hasRole('INVESTOR')")
    public ResponseEntity<Investment> fundStudent(Authentication authentication, @PathVariable String requestId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(investorService.fundStudentRequest(userDetails.getId(), requestId));
    }

    @GetMapping("/portfolio")
    @PreAuthorize("hasRole('INVESTOR')")
    public ResponseEntity<List<Investment>> getPortfolio(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(investorService.getPortfolio(userDetails.getId()));
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('INVESTOR')")
    public ResponseEntity<Map<String, Object>> getRoiAnalytics(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(investorService.getRoiAnalytics(userDetails.getId()));
    }
}
