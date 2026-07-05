package com.interviewos.backend.dto.leetcode;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class SubmitStatsGlobal {
    private List<AcSubmissionNum> acSubmissionNum;
}