package com.interviewos.backend.dto.leetcode;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class LeetCodeGraphQLRequest {
    private String query;
    private Map<String, Object> variables;
}