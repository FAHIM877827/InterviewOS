package com.interviewos.backend.service;

import com.interviewos.backend.exception.UnsupportedCompanyException;

import java.util.Map;

// Rule-based, hand-tuned topic weights (1-10) per company, reflecting the
// kinds of DSA topics each company's interview loop tends to emphasize.
// Deliberately static/simple for now - a natural place to later swap in
// real interview-pattern data without touching RoadmapService's logic.
// Topic names must match AnalyticsService.CORE_TOPICS exactly, since that's
// what TopicProficiency.getTopic() returns.
public enum CompanyTarget {

    GOOGLE("Google", Map.of(
            "Graph", 10,
            "Dynamic Programming", 9,
            "Tree", 8,
            "Backtracking", 7,
            "Binary Search", 6,
            "Greedy", 6,
            "Array", 5,
            "String", 5,
            "Hash Table", 4,
            "Two Pointers", 4
    )),
    SERVICENOW("ServiceNow", Map.of(
            "Hash Table", 9,
            "String", 8,
            "Array", 8,
            "Tree", 7,
            "Two Pointers", 6,
            "Binary Search", 6,
            "Dynamic Programming", 6,
            "Greedy", 5,
            "Graph", 5,
            "Backtracking", 4
    )),
    AMAZON("Amazon", Map.of(
            "Array", 9,
            "Tree", 8,
            "Graph", 8,
            "Hash Table", 7,
            "Dynamic Programming", 6,
            "Binary Search", 6,
            "Greedy", 6,
            "String", 5,
            "Two Pointers", 5,
            "Backtracking", 4
    )),
    ZOHO("Zoho", Map.of(
            "Array", 8,
            "String", 8,
            "Hash Table", 7,
            "Two Pointers", 7,
            "Binary Search", 6,
            "Tree", 6,
            "Dynamic Programming", 5,
            "Greedy", 5,
            "Graph", 4,
            "Backtracking", 4
    )),
    MICROSOFT("Microsoft", Map.of(
            "Tree", 9,
            "Dynamic Programming", 8,
            "Graph", 7,
            "Array", 7,
            "String", 7,
            "Backtracking", 6,
            "Hash Table", 6,
            "Binary Search", 6,
            "Two Pointers", 5,
            "Greedy", 5
    ));

    private final String displayName;
    private final Map<String, Integer> topicWeights;

    CompanyTarget(String displayName, Map<String, Integer> topicWeights) {
        this.displayName = displayName;
        this.topicWeights = topicWeights;
    }

    public String getDisplayName() {
        return displayName;
    }

    public Map<String, Integer> getTopicWeights() {
        return topicWeights;
    }

    // Case-insensitive lookup from the {company} path variable, e.g.
    // "google" or "Google" -> GOOGLE. Throws for anything unrecognized so
    // the controller/service layer always deals with a valid target.
    public static CompanyTarget fromCode(String code) {
        for (CompanyTarget target : values()) {
            if (target.name().equalsIgnoreCase(code) || target.displayName.equalsIgnoreCase(code)) {
                return target;
            }
        }
        throw new UnsupportedCompanyException(code);
    }
}