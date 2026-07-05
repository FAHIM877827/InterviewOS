package com.interviewos.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Value("${leetcode.api-url}")
    private String leetCodeApiUrl;

    @Bean
    public RestClient leetCodeRestClient() {
        return RestClient.builder()
                .baseUrl(leetCodeApiUrl)
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Referer", "https://leetcode.com")
                .defaultHeader("User-Agent", "Mozilla/5.0 (InterviewOS MVP)")
                .build();
    }
}