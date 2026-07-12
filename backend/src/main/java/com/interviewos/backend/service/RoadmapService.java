package com.interviewos.backend.service;

import com.interviewos.backend.dto.analytics.ReadinessAnalysisResponse;
import com.interviewos.backend.dto.analytics.TopicProficiency;
import com.interviewos.backend.dto.roadmap.RoadmapDayResponse;
import com.interviewos.backend.dto.roadmap.RoadmapResponse;
import com.interviewos.backend.dto.roadmap.RoadmapTaskResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

// Generates a personalized, company-specific DSA study plan by combining:
//   1. The user's own weak/strong topics from AnalyticsService (real data)
//   2. A static, rule-based topic-weight table per company (CompanyTarget)
// Nothing here is ML-driven - it's intentionally simple, deterministic
// rule-based logic. The sample problem bank below is illustrative and
// should be swapped for a real curated/tagged problem catalogue later.
@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final AnalyticsService analyticsService;

    private static final int DEFAULT_PLAN_DAYS = 7;
    private static final Set<Integer> SUPPORTED_DURATIONS = Set.of(7, 14);
    private static final int PRIORITY_TOPIC_COUNT = 5;
    private static final int HIGH_PRIORITY_TASKS_PER_DAY = 2;
    private static final int TOTAL_TASKS_PER_DAY = 3;
    private static final int ESTIMATED_HOURS_PER_DAY = 3;

    private static final Map<String, List<SampleProblem>> PROBLEM_BANK = buildProblemBank();

    public RoadmapResponse generateRoadmap(String userEmail, String companyCode, Integer requestedDays) {
        CompanyTarget company = CompanyTarget.fromCode(companyCode);
        int planDays = resolvePlanDays(requestedDays);

        // Reuses the same analytics pipeline as the dashboard - if the user
        // has no linked profile, AnalyticsService throws NoProfileDataException.
        ReadinessAnalysisResponse analysis = analyticsService.getLatestAnalysis(userEmail);

        Map<String, String> proficiencyByTopic = analysis.getTopicBreakdown().stream()
                .collect(Collectors.toMap(TopicProficiency::getTopic, TopicProficiency::getProficiencyLevel));

        List<String> priorityTopics = rankPriorityTopics(company, proficiencyByTopic);
        int companyReadinessScore = calculateCompanyReadiness(company, proficiencyByTopic, analysis.getReadinessScore());
        List<RoadmapDayResponse> days = buildDailyPlan(priorityTopics, planDays);

        return new RoadmapResponse(
                company.getDisplayName(),
                companyReadinessScore,
                priorityTopics,
                planDays,
                days,
                LocalDateTime.now()
        );
    }

    private int resolvePlanDays(Integer requestedDays) {
        if (requestedDays == null || !SUPPORTED_DURATIONS.contains(requestedDays)) {
            return DEFAULT_PLAN_DAYS;
        }
        return requestedDays;
    }

    // Highest company-weight topics first; among equal weights, the user's
    // weakest topic wins so the plan naturally leans into what they need
    // most for this specific company rather than just the company's
    // generic top topics.
    private List<String> rankPriorityTopics(CompanyTarget company, Map<String, String> proficiencyByTopic) {
        return company.getTopicWeights().entrySet().stream()
                .sorted((a, b) -> {
                    int weightCompare = b.getValue().compareTo(a.getValue());
                    if (weightCompare != 0) {
                        return weightCompare;
                    }
                    return proficiencyRank(proficiencyByTopic.get(a.getKey()))
                            - proficiencyRank(proficiencyByTopic.get(b.getKey()));
                })
                .map(Map.Entry::getKey)
                .limit(PRIORITY_TOPIC_COUNT)
                .collect(Collectors.toList());
    }

    private int proficiencyRank(String proficiency) {
        if ("STRONG".equals(proficiency)) return 2;
        if ("MODERATE".equals(proficiency)) return 1;
        return 0; // WEAK, or no data yet for that topic
    }

    // Blends the user's overall readiness score with how well their
    // per-topic proficiency lines up with this specific company's topic
    // weights - a user can be broadly "ready" but still weak in exactly
    // what one particular company emphasizes.
    private int calculateCompanyReadiness(
            CompanyTarget company, Map<String, String> proficiencyByTopic, int overallReadinessScore) {

        int totalWeight = 0;
        double weightedProficiency = 0;

        for (Map.Entry<String, Integer> entry : company.getTopicWeights().entrySet()) {
            int weight = entry.getValue();
            int proficiencyScore = proficiencyScore(proficiencyByTopic.get(entry.getKey()));
            weightedProficiency += weight * proficiencyScore;
            totalWeight += weight;
        }

        int companyTopicScore = totalWeight == 0 ? 0 : (int) Math.round(weightedProficiency / totalWeight);
        int blended = (int) Math.round((companyTopicScore * 0.6) + (overallReadinessScore * 0.4));
        return Math.min(100, Math.max(0, blended));
    }

    private int proficiencyScore(String proficiency) {
        if ("STRONG".equals(proficiency)) return 100;
        if ("MODERATE".equals(proficiency)) return 60;
        return 20; // WEAK, or no data yet for that topic
    }

    private List<RoadmapDayResponse> buildDailyPlan(List<String> priorityTopics, int planDays) {
        List<RoadmapDayResponse> days = new ArrayList<>();
        if (priorityTopics.isEmpty()) {
            return days;
        }

        for (int day = 1; day <= planDays; day++) {
            // Rotate through the priority topics so every topic recurs
            // across the plan instead of front-loading it all on topic #1.
            String primaryTopic = priorityTopics.get((day - 1) % priorityTopics.size());
            String secondaryTopic = priorityTopics.get(day % priorityTopics.size());

            List<RoadmapTaskResponse> tasks = new ArrayList<>();
            tasks.addAll(tasksForTopic(primaryTopic, "HIGH", HIGH_PRIORITY_TASKS_PER_DAY));
            tasks.addAll(tasksForTopic(secondaryTopic, "MEDIUM", TOTAL_TASKS_PER_DAY - HIGH_PRIORITY_TASKS_PER_DAY));

            days.add(new RoadmapDayResponse(
                    day,
                    List.of(primaryTopic, secondaryTopic),
                    tasks,
                    ESTIMATED_HOURS_PER_DAY
            ));
        }
        return days;
    }

    private List<RoadmapTaskResponse> tasksForTopic(String topic, String priority, int count) {
        List<SampleProblem> problems = PROBLEM_BANK.getOrDefault(topic, PROBLEM_BANK.get("Array"));
        List<RoadmapTaskResponse> tasks = new ArrayList<>();
        for (int i = 0; i < count && i < problems.size(); i++) {
            SampleProblem problem = problems.get(i);
            tasks.add(new RoadmapTaskResponse(topic, problem.title(), problem.difficulty(), priority));
        }
        return tasks;
    }

    private record SampleProblem(String title, String difficulty) {
    }

    // Curated sample problems per topic (topic names match
    // AnalyticsService.CORE_TOPICS). Illustrative for now - swap for a real
    // problem catalogue/tagged dataset later without touching the rest of
    // the service.
    private static Map<String, List<SampleProblem>> buildProblemBank() {
        Map<String, List<SampleProblem>> bank = new HashMap<>();

        bank.put("Array", List.of(
                new SampleProblem("Two Sum", "Easy"),
                new SampleProblem("Product of Array Except Self", "Medium"),
                new SampleProblem("Merge Intervals", "Medium")
        ));
        bank.put("String", List.of(
                new SampleProblem("Longest Substring Without Repeating Characters", "Medium"),
                new SampleProblem("Group Anagrams", "Medium"),
                new SampleProblem("Minimum Window Substring", "Hard")
        ));
        bank.put("Hash Table", List.of(
                new SampleProblem("Two Sum", "Easy"),
                new SampleProblem("Subarray Sum Equals K", "Medium"),
                new SampleProblem("Longest Consecutive Sequence", "Medium")
        ));
        bank.put("Two Pointers", List.of(
                new SampleProblem("3Sum", "Medium"),
                new SampleProblem("Container With Most Water", "Medium"),
                new SampleProblem("Trapping Rain Water", "Hard")
        ));
        bank.put("Dynamic Programming", List.of(
                new SampleProblem("House Robber", "Medium"),
                new SampleProblem("Longest Increasing Subsequence", "Medium"),
                new SampleProblem("Edit Distance", "Hard")
        ));
        bank.put("Tree", List.of(
                new SampleProblem("Binary Tree Level Order Traversal", "Medium"),
                new SampleProblem("Lowest Common Ancestor of a BST", "Medium"),
                new SampleProblem("Serialize and Deserialize Binary Tree", "Hard")
        ));
        bank.put("Graph", List.of(
                new SampleProblem("Number of Islands", "Medium"),
                new SampleProblem("Course Schedule", "Medium"),
                new SampleProblem("Word Ladder", "Hard")
        ));
        bank.put("Binary Search", List.of(
                new SampleProblem("Search in Rotated Sorted Array", "Medium"),
                new SampleProblem("Find Minimum in Rotated Sorted Array", "Medium"),
                new SampleProblem("Median of Two Sorted Arrays", "Hard")
        ));
        bank.put("Greedy", List.of(
                new SampleProblem("Jump Game", "Medium"),
                new SampleProblem("Gas Station", "Medium"),
                new SampleProblem("Task Scheduler", "Medium")
        ));
        bank.put("Backtracking", List.of(
                new SampleProblem("Subsets", "Medium"),
                new SampleProblem("Permutations", "Medium"),
                new SampleProblem("N-Queens", "Hard")
        ));

        return bank;
    }
}