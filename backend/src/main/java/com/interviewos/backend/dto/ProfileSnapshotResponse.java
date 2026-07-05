package com.interviewos.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class ProfileSnapshotResponse {

    private Integer totalSolved;
    private Integer easySolved;
    private Integer mediumSolved;
    private Integer hardSolved;
    private Map<String, Integer> tagBreakdown;
    private Integer readinessScore;
    private List<String> weakTopics;
    private LocalDateTime fetchedAt;
}