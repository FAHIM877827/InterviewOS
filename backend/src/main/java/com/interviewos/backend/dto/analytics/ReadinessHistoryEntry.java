package com.interviewos.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ReadinessHistoryEntry {

    private Integer readinessScore;
    private LocalDateTime fetchedAt;
}