package com.interviewos.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "profile_snapshots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileSnapshot {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total_solved")
    private Integer totalSolved;

    @Column(name = "easy_solved")
    private Integer easySolved;

    @Column(name = "medium_solved")
    private Integer mediumSolved;

    @Column(name = "hard_solved")
    private Integer hardSolved;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tag_breakdown", columnDefinition = "jsonb")
    private Map<String, Integer> tagBreakdown;

    @Column(name = "readiness_score")
    private Integer readinessScore;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "weak_topics", columnDefinition = "jsonb")
    private List<String> weakTopics;

    @Column(name = "fetched_at", updatable = false)
    private LocalDateTime fetchedAt;

    @PrePersist
    protected void onCreate() {
        this.fetchedAt = LocalDateTime.now();
    }
}