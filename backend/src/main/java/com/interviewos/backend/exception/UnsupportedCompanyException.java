package com.interviewos.backend.exception;

public class UnsupportedCompanyException extends RuntimeException {
    public UnsupportedCompanyException(String company) {
        super("Unsupported target company: " + company
                + ". Supported companies: google, servicenow, amazon, zoho, microsoft");
    }
}