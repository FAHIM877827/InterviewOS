package com.interviewos.backend.dto.leetcode;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class TagCount {
    private String tagName;
    private String tagSlug;
    private Integer problemsSolved;
}