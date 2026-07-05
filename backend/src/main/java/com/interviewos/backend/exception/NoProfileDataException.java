package com.interviewos.backend.exception;

public class NoProfileDataException extends RuntimeException {
    public NoProfileDataException(String email) {
        super("No LeetCode profile data found for user: " + email + ". Link a profile first.");
    }
}