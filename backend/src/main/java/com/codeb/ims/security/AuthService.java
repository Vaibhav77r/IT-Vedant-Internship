package com.codeb.ims.service;

import com.codeb.ims.dto.*;
import com.codeb.ims.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {

        String token = jwtUtil.generateToken(req.getEmail(), req.getRole());

        return AuthResponse.builder()
                .token(token)
                .role(req.getRole())
                .fullName(req.getFullName())
                .email(req.getEmail())
                .message("Registration successful (No DB)")
                .build();
    }

    public AuthResponse login(LoginRequest req) {

        String token = jwtUtil.generateToken(req.getEmail(), "USER");

        return AuthResponse.builder()
                .token(token)
                .role("USER")
                .fullName("Test User")
                .email(req.getEmail())
                .message("Login successful (No DB)")
                .build();
    }
}