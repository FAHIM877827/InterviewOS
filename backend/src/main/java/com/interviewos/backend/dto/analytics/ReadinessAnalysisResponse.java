package com.interviewos.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ReadinessAnalysisResponse {

    private Integer readinessScore;
    private Integer totalSolved;
    private Integer easySolved;
    private Integer mediumSolved;
    private Integer hardSolved;
    private List<TopicProficiency> topicBreakdown;
    private List<String> weakTopics;
    private Integer previousScore;
    private String trend;
    private LocalDateTime fetchedAt;
}