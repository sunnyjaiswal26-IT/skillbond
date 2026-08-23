package com.skillbond.controller;

import com.skillbond.model.*;
import com.skillbond.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/toggle-status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable String userId, @RequestParam boolean enabled) {
        return ResponseEntity.ok(adminService.toggleUserStatus(userId, enabled));
    }

    @PutMapping("/users/{userId}/approve")
    public ResponseEntity<User> approveUser(@PathVariable String userId, @RequestParam boolean approved) {
        return ResponseEntity.ok(adminService.approveUserAccount(userId, approved));
    }

    @GetMapping("/funding-requests")
    public ResponseEntity<List<FundingRequest>> getAllFundingRequests() {
        return ResponseEntity.ok(adminService.getAllFundingRequests());
    }

    @PutMapping("/funding-requests/{requestId}/status")
    public ResponseEntity<FundingRequest> updateFundingRequestStatus(
            @PathVariable String requestId,
            @RequestParam String status,
            @RequestParam(required = false) String adminNotes) {
        return ResponseEntity.ok(adminService.updateFundingRequestStatus(requestId, status, adminNotes));
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getPlatformAnalytics() {
        return ResponseEntity.ok(adminService.getPlatformAnalytics());
    }

    @GetMapping("/settings")
    public ResponseEntity<SystemSettings> getSystemSettings() {
        return ResponseEntity.ok(adminService.getSystemSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<SystemSettings> updateSystemSettings(@RequestBody SystemSettings settings) {
        return ResponseEntity.ok(adminService.updateSystemSettings(settings));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(adminService.getAllTransactions());
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(adminService.getAuditLogs());
    }
}
