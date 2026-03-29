package com.codeb.ims.dto;

public class AuthResponse {
    private String token;
    private String role;
    private String fullName;
    private String email;
    private String message;

    public AuthResponse() {}
    public AuthResponse(String token, String role, String fullName, String email, String message) {
        this.token = token; this.role = role; this.fullName = fullName;
        this.email = email; this.message = message;
    }

    public String getToken() { return token; }
    public String getRole() { return role; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getMessage() { return message; }
}