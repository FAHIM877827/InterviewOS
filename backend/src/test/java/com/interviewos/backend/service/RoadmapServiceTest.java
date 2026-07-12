package com.interviewos.backend.service;

import com.interviewos.backend.dto.analytics.ReadinessAnalysisResponse;
import com.interviewos.backend.dto.analytics.TopicProficiency;
import com.interviewos.backend.dto.roadmap.RoadmapResponse;
import com.interviewos.backend.exception.UnsupportedCompanyException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

// Plain unit test - RoadmapService depends only on AnalyticsService, so it
// is mocked directly with no Spring context needed. Fast and isolated.
class RoadmapServiceTest {

    private AnalyticsService analyticsService;
    private RoadmapService roadmapService;

    @BeforeEach
    void setUp() {
        analyticsService = mock(AnalyticsService.class);
        roadmapService = new RoadmapService(analyticsService);
    }

    @Test
    void generateRoadmap_buildsPlanMatchingRequestedDuration() {
        when(analyticsService.getLatestAnalysis("user@example.com")).thenReturn(sampleAnalysis());

        RoadmapResponse response = roadmapService.generateRoadmap("user@example.com", "google", 7);

        assertEquals("Google", response.getCompany());
        assertEquals(7, response.getPlanDurationDays());
        assertEquals(7, response.getDays().size());
        assertTrue(response.getCompanyReadinessScore() >= 0 && response.getCompanyReadinessScore() <= 100);
        assertTrue(response.getPriorityTopics().contains("Graph"));
    }

    @Test
    void generateRoadmap_defaultsTo7DaysForUnsupportedDuration() {
        when(analyticsService.getLatestAnalysis("user@example.com")).thenReturn(sampleAnalysis());

        RoadmapResponse response = roadmapService.generateRoadmap("user@example.com", "amazon", 30);

        assertEquals(7, response.getPlanDurationDays());
    }

    @Test
    void generateRoadmap_throwsForUnknownCompany() {
        assertThrows(UnsupportedCompanyException.class,
                () -> roadmapService.generateRoadmap("user@example.com", "openai", 7));
    }

    private ReadinessAnalysisResponse sampleAnalysis() {
        List<TopicProficiency> breakdown = List.of(
                new TopicProficiency("Array", 12, "STRONG"),
                new TopicProficiency("Graph", 1, "WEAK"),
                new TopicProficiency("Dynamic Programming", 2, "WEAK"),
                new TopicProficiency("Tree", 5, "MODERATE"),
                new TopicProficiency("String", 6, "MODERATE"),
                new TopicProficiency("Hash Table", 4, "MODERATE"),
                new TopicProficiency("Two Pointers", 3, "WEAK"),
                new TopicProficiency("Binary Search", 2, "WEAK"),
                new TopicProficiency("Greedy", 1, "WEAK"),
                new TopicProficiency("Backtracking", 0, "WEAK")
        );

        return new ReadinessAnalysisResponse(
                55, 36, 20, 12, 4,
                breakdown,
                List.of("Graph", "Dynamic Programming", "Backtracking"),
                48,
                "IMPROVING",
                LocalDateTime.now()
        );
    }
}