package com.interviewos.backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class DashboardSummaryResponse {

    private String leetcodeUsername;
    private Integer readinessScore;
    private Integer previousScore;
    private String trend;
    private Integer totalSolved;
    private Integer easySolved;
    private Integer mediumSolved;
    private Integer hardSolved;
    private List<String> weakTopics;
    private List<String> strongTopics;
    private LocalDateTime fetchedAt;
}