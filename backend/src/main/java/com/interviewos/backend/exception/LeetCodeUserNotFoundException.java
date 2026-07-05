package com.interviewos.backend.exception;

public class LeetCodeUserNotFoundException extends RuntimeException {
    public LeetCodeUserNotFoundException(String username) {
        super("No LeetCode user found with username: " + username);
    }
}