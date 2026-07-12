package com.interviewos.backend.controller;

import com.interviewos.backend.dto.roadmap.RoadmapResponse;
import com.interviewos.backend.service.RoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roadmap")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;

    // {company} matches CompanyTarget.fromCode's case-insensitive lookup
    // (e.g. "google" or "Google"). ?days is optional - RoadmapService
    // already falls back to DEFAULT_PLAN_DAYS for null or unsupported
    // values, so no extra validation is needed here.
    @GetMapping("/{company}")
    public ResponseEntity<RoadmapResponse> getRoadmap(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String company,
            @RequestParam(required = false) Integer days) {

        RoadmapResponse response = roadmapService.generateRoadmap(userDetails.getUsername(), company, days);
        return ResponseEntity.ok(response);
    }
}