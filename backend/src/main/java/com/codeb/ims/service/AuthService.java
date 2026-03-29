package com.codeb.ims.service;

import com.codeb.ims.dto.*;
import com.codeb.ims.entity.User;
import com.codeb.ims.repository.UserRepository;
import com.codeb.ims.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole().toUpperCase())
                .status(User.Status.active)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .message("Registration successful")
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (user.getStatus() == User.Status.inactive) {
            throw new RuntimeException("Account is inactive. Contact admin.");
        }

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .message("Login successful")
                .build();
    }
}