package com.interviewos.backend.dto.roadmap;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class RoadmapDayResponse {

    private Integer day;
    private List<String> focusTopics;
    private List<RoadmapTaskResponse> tasks;
    private Integer estimatedHours;
}