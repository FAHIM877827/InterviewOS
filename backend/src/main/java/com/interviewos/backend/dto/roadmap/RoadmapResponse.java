package com.interviewos.backend.dto.roadmap;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class RoadmapResponse {

    private String company;
    private Integer companyReadinessScore;
    private List<String> priorityTopics;
    private Integer planDurationDays;
    private List<RoadmapDayResponse> days;
    private LocalDateTime generatedAt;
}