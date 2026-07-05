package com.interviewos.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TopicProficiency {

    private String topic;
    private Integer solvedCount;
    private String proficiencyLevel;
}