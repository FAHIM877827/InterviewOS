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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final LeetCodeService leetCodeService;
    private final UserRepository userRepository;
    private final ProfileSnapshotRepository profileSnapshotRepository;
    private final AnalyticsService analyticsService;

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

        int readinessScore = analyticsService.calculateReadinessScore(easySolved, mediumSolved, hardSolved);
        List<String> weakTopics = analyticsService.calculateWeakTopics(tagBreakdown);

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
        log.info("Linked LeetCode profile '{}' for user {} (readinessScore={})",
                request.getLeetcodeUsername(), userEmail, readinessScore);

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
}