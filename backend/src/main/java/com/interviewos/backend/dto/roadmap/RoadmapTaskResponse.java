package com.interviewos.backend.dto.roadmap;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RoadmapTaskResponse {

    private String topic;
    private String problemTitle;
    private String difficulty;
    private String priority;
}