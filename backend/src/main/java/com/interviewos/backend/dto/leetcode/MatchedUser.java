package com.interviewos.backend.dto.leetcode;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class MatchedUser {
    private String username;
    private SubmitStatsGlobal submitStatsGlobal;
    private TagProblemCounts tagProblemCounts;
}