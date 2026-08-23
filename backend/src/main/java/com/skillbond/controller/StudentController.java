package com.skillbond.controller;

import com.skillbond.model.FundingRequest;
import com.skillbond.model.Investment;
import com.skillbond.model.Repayment;
import com.skillbond.model.Student;
import com.skillbond.security.services.UserDetailsImpl;
import com.skillbond.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<Student> getProfile(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(studentService.getStudentByUserId(userDetails.getId()));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<Student> updateProfile(Authentication authentication, @RequestBody Student student) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(studentService.updateStudentProfile(userDetails.getId(), student));
    }

    @PostMapping("/funding-request")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<FundingRequest> createFundingRequest(Authentication authentication, @RequestBody FundingRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(studentService.createFundingRequest(userDetails.getId(), userDetails.getFullName(), request));
    }

    @GetMapping("/funding-requests")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<FundingRequest>> getMyFundingRequests(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(studentService.getMyFundingRequests(userDetails.getId()));
    }

    @GetMapping("/investments")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Investment>> getMyAcceptedInvestments(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(studentService.getMyAcceptedInvestments(userDetails.getId()));
    }

    @GetMapping("/repayments")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Repayment>> getMyRepayments(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(studentService.getMyRepayments(userDetails.getId()));
    }
}
