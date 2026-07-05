package com.interviewos.backend.service;

import com.interviewos.backend.dto.analytics.ReadinessAnalysisResponse;
import com.interviewos.backend.dto.analytics.ReadinessHistoryEntry;
import com.interviewos.backend.dto.analytics.ReadinessHistoryResponse;
import com.interviewos.backend.dto.analytics.TopicProficiency;
import com.interviewos.backend.exception.NoProfileDataException;
import com.interviewos.backend.model.ProfileSnapshot;
import com.interviewos.backend.model.User;
import com.interviewos.backend.repository.ProfileSnapshotRepository;
import com.interviewos.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRepository userRepository;
    private final ProfileSnapshotRepository profileSnapshotRepository;

    private static final List<String> CORE_TOPICS = List.of(
            "Array", "String", "Hash Table", "Two Pointers", "Dynamic Programming",
            "Tree", "Graph", "Binary Search", "Greedy", "Backtracking"
    );

    private static final int READINESS_TARGET_POINTS = 300;
    private static final int WEAK_TOPIC_COUNT = 3;
    private static final int STRONG_THRESHOLD = 8;
    private static final int MODERATE_THRESHOLD = 3;

    public int calculateReadinessScore(int easySolved, int mediumSolved, int hardSolved) {
        int weightedPoints = (easySolved * 1) + (mediumSolved * 2) + (hardSolved * 3);
        int score = (int) Math.round((weightedPoints / (double) READINESS_TARGET_POINTS) * 100);
        return Math.min(100, Math.max(0, score));
    }

    public List<String> calculateWeakTopics(Map<String, Integer> tagBreakdown) {
        return rankTopicsByCount(tagBreakdown).stream()
                .limit(WEAK_TOPIC_COUNT)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    public ReadinessAnalysisResponse getLatestAnalysis(String userEmail) {
        User user = getUser(userEmail);
        List<ProfileSnapshot> snapshots = profileSnapshotRepository.findByUserOrderByFetchedAtDesc(user);

        if (snapshots.isEmpty()) {
            throw new NoProfileDataException(userEmail);
        }

        ProfileSnapshot latest = snapshots.get(0);
        Integer previousScore = snapshots.size() > 1 ? snapshots.get(1).getReadinessScore() : null;

        List<TopicProficiency> topicBreakdown = buildTopicBreakdown(latest.getTagBreakdown());

        return new ReadinessAnalysisResponse(
                latest.getReadinessScore(),
                latest.getTotalSolved(),
                latest.getEasySolved(),
                latest.getMediumSolved(),
                latest.getHardSolved(),
                topicBreakdown,
                latest.getWeakTopics(),
                previousScore,
                resolveTrend(latest.getReadinessScore(), previousScore),
                latest.getFetchedAt()
        );
    }

    public ReadinessHistoryResponse getReadinessHistory(String userEmail) {
        User user = getUser(userEmail);
        List<ProfileSnapshot> snapshots = profileSnapshotRepository.findByUserOrderByFetchedAtDesc(user);

        if (snapshots.isEmpty()) {
            throw new NoProfileDataException(userEmail);
        }

        List<ReadinessHistoryEntry> entries = snapshots.stream()
                .sorted(Comparator.comparing(ProfileSnapshot::getFetchedAt))
                .map(snapshot -> new ReadinessHistoryEntry(snapshot.getReadinessScore(), snapshot.getFetchedAt()))
                .collect(Collectors.toList());

        return new ReadinessHistoryResponse(entries);
    }

    private User getUser(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userEmail));
    }

    private List<TopicProficiency> buildTopicBreakdown(Map<String, Integer> tagBreakdown) {
        List<TopicProficiency> breakdown = new ArrayList<>();
        for (String topic : CORE_TOPICS) {
            int solved = tagBreakdown == null ? 0 : tagBreakdown.getOrDefault(topic, 0);
            breakdown.add(new TopicProficiency(topic, solved, resolveProficiency(solved)));
        }
        return breakdown;
    }

    private String resolveProficiency(int solved) {
        if (solved >= STRONG_THRESHOLD) return "STRONG";
        if (solved >= MODERATE_THRESHOLD) return "MODERATE";
        return "WEAK";
    }

    private String resolveTrend(Integer latestScore, Integer previousScore) {
        if (previousScore == null) return "NEW";
        if (latestScore > previousScore) return "IMPROVING";
        if (latestScore < previousScore) return "DECLINING";
        return "STABLE";
    }

    private List<Map.Entry<String, Integer>> rankTopicsByCount(Map<String, Integer> tagBreakdown) {
        List<Map.Entry<String, Integer>> ranked = new ArrayList<>();
        for (String topic : CORE_TOPICS) {
            int count = tagBreakdown == null ? 0 : tagBreakdown.getOrDefault(topic, 0);
            ranked.add(Map.entry(topic, count));
        }
        ranked.sort(Comparator.comparingInt(Map.Entry::getValue));
        return ranked;
    }
}