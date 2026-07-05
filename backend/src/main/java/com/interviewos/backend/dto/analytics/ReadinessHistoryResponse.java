package com.interviewos.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ReadinessHistoryResponse {

    private List<ReadinessHistoryEntry> history;
}