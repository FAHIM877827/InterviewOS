package com.interviewos.backend.service;

import com.interviewos.backend.dto.analytics.ReadinessAnalysisResponse;
import com.interviewos.backend.dto.analytics.ReadinessHistoryResponse;
import com.interviewos.backend.dto.analytics.TopicProficiency;
import com.interviewos.backend.dto.dashboard.DashboardSummaryResponse;
import com.interviewos.backend.dto.dashboard.DashboardTopicsResponse;
import com.interviewos.backend.model.User;
import com.interviewos.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    private static final String STRONG_PROFICIENCY = "STRONG";

    public DashboardSummaryResponse getSummary(String userEmail) {
        User user = getUser(userEmail);
        ReadinessAnalysisResponse analysis = analyticsService.getLatestAnalysis(userEmail);
        List<String> strongTopics = extractStrongTopics(analysis.getTopicBreakdown());

        return new DashboardSummaryResponse(
                user.getLeetcodeUsername(),
                analysis.getReadinessScore(),
                analysis.getPreviousScore(),
                analysis.getTrend(),
                analysis.getTotalSolved(),
                analysis.getEasySolved(),
                analysis.getMediumSolved(),
                analysis.getHardSolved(),
                analysis.getWeakTopics(),
                strongTopics,
                analysis.getFetchedAt()
        );
    }

    public ReadinessHistoryResponse getHistory(String userEmail) {
        return analyticsService.getReadinessHistory(userEmail);
    }

    public DashboardTopicsResponse getTopics(String userEmail) {
        ReadinessAnalysisResponse analysis = analyticsService.getLatestAnalysis(userEmail);
        List<String> strongTopics = extractStrongTopics(analysis.getTopicBreakdown());

        return new DashboardTopicsResponse(
                analysis.getTopicBreakdown(),
                analysis.getWeakTopics(),
                strongTopics
        );
    }

    private User getUser(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userEmail));
    }

    private List<String> extractStrongTopics(List<TopicProficiency> topicBreakdown) {
        if (topicBreakdown == null) {
            return List.of();
        }
        return topicBreakdown.stream()
                .filter(topic -> STRONG_PROFICIENCY.equals(topic.getProficiencyLevel()))
                .map(TopicProficiency::getTopic)
                .collect(Collectors.toList());
    }
}