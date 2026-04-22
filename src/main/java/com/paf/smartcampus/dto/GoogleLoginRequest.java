package com.paf.smartcampus.dto;

public class GoogleLoginRequest {
    private String credential;
    private String expectedRole;

    public GoogleLoginRequest() {}

    public GoogleLoginRequest(String credential, String expectedRole) {
        this.credential = credential;
        this.expectedRole = expectedRole;
    }

    public String getCredential() { return credential; }
    public void setCredential(String credential) { this.credential = credential; }

    public String getExpectedRole() { return expectedRole; }
    public void setExpectedRole(String expectedRole) { this.expectedRole = expectedRole; }
}