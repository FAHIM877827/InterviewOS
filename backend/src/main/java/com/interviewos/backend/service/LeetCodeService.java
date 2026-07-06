package com.interviewos.backend.service;

import com.interviewos.backend.dto.leetcode.LeetCodeGraphQLRequest;
import com.interviewos.backend.dto.leetcode.LeetCodeGraphQLResponse;
import com.interviewos.backend.dto.leetcode.MatchedUser;
import com.interviewos.backend.exception.LeetCodeUserNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeetCodeService {

    private final RestClient leetCodeRestClient;

    // Public LeetCode GraphQL query - no auth required, matches leetcode.com/<user> data
    private static final String PROFILE_QUERY = """
            query userProfileStats($username: String!) {
              matchedUser(username: $username) {
                username
                submitStatsGlobal {
                  acSubmissionNum {
                    difficulty
                    count
                  }
                }
                tagProblemCounts {
                  advanced {
                    tagName
                    tagSlug
                    problemsSolved
                  }
                  intermediate {
                    tagName
                    tagSlug
                    problemsSolved
                  }
                  fundamental {
                    tagName
                    tagSlug
                    problemsSolved
                  }
                }
              }
            }
            """;

    public MatchedUser fetchProfile(String username) {
        LeetCodeGraphQLRequest request = new LeetCodeGraphQLRequest(
                PROFILE_QUERY,
                Map.of("username", username)
        );

        LeetCodeGraphQLResponse response = leetCodeRestClient.post()
                .body(request)
                .retrieve()
                .body(LeetCodeGraphQLResponse.class);

        if (response == null || response.getData() == null || response.getData().getMatchedUser() == null) {
            log.info("LeetCode username not found: {}", username);
            throw new LeetCodeUserNotFoundException(username);
        }

        return response.getData().getMatchedUser();
    }
}