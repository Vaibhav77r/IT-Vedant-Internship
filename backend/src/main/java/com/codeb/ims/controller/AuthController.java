package com.codeb.ims.controller;

import com.codeb.ims.dto.*;
import com.codeb.ims.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // GET /api/auth/me  (protected — needs valid JWT)
    @GetMapping("/me")
    public ResponseEntity<String> me(jakarta.servlet.http.HttpServletRequest req) {
        String email = (String) req.getAttribute("email");
        return ResponseEntity.ok("Authenticated as: " + req.getUserPrincipal().getName());
    }
}