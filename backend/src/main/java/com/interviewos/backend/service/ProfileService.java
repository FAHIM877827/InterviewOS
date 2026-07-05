package com.interviewos.backend.service;

import com.interviewos.backend.dto.LinkProfileRequest;
import com.interviewos.backend.dto.ProfileSnapshotResponse;
import com.interviewos.backend.dto.leetcode.AcSubmissionNum;
import com.interviewos.backend.dto.leetcode.MatchedUser;
import com.interviewos.backend.dto.leetcode.TagCount;
import com.interviewos.backend.model.ProfileSnapshot;
import com.interviewos.backend.model.User;
import com.interviewos.backend.repository.ProfileSnapshotRepository;
import com.interviewos.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final LeetCodeService leetCodeService;
    private final UserRepository userRepository;
    private final ProfileSnapshotRepository profileSnapshotRepository;

    private static final List<String> CORE_TOPICS = List.of(
            "Array", "String", "Hash Table", "Two Pointers", "Dynamic Programming",
            "Tree", "Graph", "Binary Search", "Greedy", "Backtracking"
    );

    private static final int READINESS_TARGET_POINTS = 300;

    public ProfileSnapshotResponse linkProfile(String userEmail, LinkProfileRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userEmail));

        MatchedUser leetCodeProfile = leetCodeService.fetchProfile(request.getLeetcodeUsername());

        user.setLeetcodeUsername(request.getLeetcodeUsername());
        userRepository.save(user);

        Map<String, Integer> difficultyCounts = extractDifficultyCounts(leetCodeProfile);
        Map<String, Integer> tagBreakdown = extractTagBreakdown(leetCodeProfile);

        int easySolved = difficultyCounts.getOrDefault("Easy", 0);
        int mediumSolved = difficultyCounts.getOrDefault("Medium", 0);
        int hardSolved = difficultyCounts.getOrDefault("Hard", 0);
        int totalSolved = difficultyCounts.getOrDefault("All", easySolved + mediumSolved + hardSolved);

        int readinessScore = calculateReadinessScore(easySolved, mediumSolved, hardSolved);
        List<String> weakTopics = calculateWeakTopics(tagBreakdown);

        ProfileSnapshot snapshot = new ProfileSnapshot();
        snapshot.setUser(user);
        snapshot.setTotalSolved(totalSolved);
        snapshot.setEasySolved(easySolved);
        snapshot.setMediumSolved(mediumSolved);
        snapshot.setHardSolved(hardSolved);
        snapshot.setTagBreakdown(tagBreakdown);
        snapshot.setReadinessScore(readinessScore);
        snapshot.setWeakTopics(weakTopics);

        profileSnapshotRepository.save(snapshot);

        return new ProfileSnapshotResponse(
                totalSolved, easySolved, mediumSolved, hardSolved,
                tagBreakdown, readinessScore, weakTopics, snapshot.getFetchedAt()
        );
    }

    private Map<String, Integer> extractDifficultyCounts(MatchedUser profile) {
        Map<String, Integer> counts = new HashMap<>();
        if (profile.getSubmitStatsGlobal() != null && profile.getSubmitStatsGlobal().getAcSubmissionNum() != null) {
            for (AcSubmissionNum entry : profile.getSubmitStatsGlobal().getAcSubmissionNum()) {
                counts.put(entry.getDifficulty(), entry.getCount());
            }
        }
        return counts;
    }

    private Map<String, Integer> extractTagBreakdown(MatchedUser profile) {
        Map<String, Integer> tagBreakdown = new HashMap<>();
        if (profile.getTagProblemCounts() != null) {
            mergeTagCounts(tagBreakdown, profile.getTagProblemCounts().getAdvanced());
            mergeTagCounts(tagBreakdown, profile.getTagProblemCounts().getIntermediate());
            mergeTagCounts(tagBreakdown, profile.getTagProblemCounts().getFundamental());
        }
        return tagBreakdown;
    }

    private void mergeTagCounts(Map<String, Integer> target, List<TagCount> tagCounts) {
        if (tagCounts == null) return;
        for (TagCount tagCount : tagCounts) {
            target.put(tagCount.getTagName(), tagCount.getProblemsSolved());
        }
    }

    private int calculateReadinessScore(int easy, int medium, int hard) {
        int weightedPoints = (easy * 1) + (medium * 2) + (hard * 3);
        int score = (int) Math.round((weightedPoints / (double) READINESS_TARGET_POINTS) * 100);
        return Math.min(100, Math.max(0, score));
    }

    private List<String> calculateWeakTopics(Map<String, Integer> tagBreakdown) {
        List<Map.Entry<String, Integer>> ranked = new ArrayList<>();
        for (String topic : CORE_TOPICS) {
            ranked.add(Map.entry(topic, tagBreakdown.getOrDefault(topic, 0)));
        }

        ranked.sort(Comparator.comparingInt(Map.Entry::getValue));

        List<String> weakTopics = new ArrayList<>();
        for (int i = 0; i < Math.min(3, ranked.size()); i++) {
            weakTopics.add(ranked.get(i).getKey());
        }
        return weakTopics;
    }
}