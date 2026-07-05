package com.interviewos.backend.controller;

import com.interviewos.backend.dto.analytics.ReadinessHistoryResponse;
import com.interviewos.backend.dto.dashboard.DashboardSummaryResponse;
import com.interviewos.backend.dto.dashboard.DashboardTopicsResponse;
import com.interviewos.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(
            @AuthenticationPrincipal UserDetails userDetails) {

        DashboardSummaryResponse response = dashboardService.getSummary(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<ReadinessHistoryResponse> getHistory(
            @AuthenticationPrincipal UserDetails userDetails) {

        ReadinessHistoryResponse response = dashboardService.getHistory(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/topics")
    public ResponseEntity<DashboardTopicsResponse> getTopics(
            @AuthenticationPrincipal UserDetails userDetails) {

        DashboardTopicsResponse response = dashboardService.getTopics(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}