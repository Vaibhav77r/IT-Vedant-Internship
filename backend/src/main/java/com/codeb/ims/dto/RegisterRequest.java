package com.codeb.ims.dto;

public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String role;

    public String getFullName() { return fullName; }
    public void setFullName(String v) { this.fullName = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getPassword() { return password; }
    public void setPassword(String v) { this.password = v; }
    public String getRole() { return role; }
    public void setRole(String v) { this.role = v; }
}