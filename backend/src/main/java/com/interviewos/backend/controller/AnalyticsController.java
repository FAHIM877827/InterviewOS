package com.interviewos.backend.controller;

import com.interviewos.backend.dto.analytics.ReadinessAnalysisResponse;
import com.interviewos.backend.dto.analytics.ReadinessHistoryResponse;
import com.interviewos.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/readiness")
    public ResponseEntity<ReadinessAnalysisResponse> getReadiness(
            @AuthenticationPrincipal UserDetails userDetails) {

        ReadinessAnalysisResponse response = analyticsService.getLatestAnalysis(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<ReadinessHistoryResponse> getHistory(
            @AuthenticationPrincipal UserDetails userDetails) {

        ReadinessHistoryResponse response = analyticsService.getReadinessHistory(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}