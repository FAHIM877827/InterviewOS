package com.interviewos.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LinkProfileRequest {

    @NotBlank(message = "LeetCode username is required")
    private String leetcodeUsername;
}