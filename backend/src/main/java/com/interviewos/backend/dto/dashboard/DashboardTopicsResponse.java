package com.interviewos.backend.dto.dashboard;

import com.interviewos.backend.dto.analytics.TopicProficiency;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class DashboardTopicsResponse {

    private List<TopicProficiency> topicBreakdown;
    private List<String> weakTopics;
    private List<String> strongTopics;
}