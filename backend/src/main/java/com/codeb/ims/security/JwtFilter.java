package com.codeb.ims.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.*;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println("=== JWT FILTER ===");
        System.out.println("URL: " + request.getRequestURI());
        System.out.println("Auth Header: " + authHeader);

        // ✅ Check Bearer token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {
                // ✅ Validate token
                if (jwtUtil.isTokenValid(token)) {

                    String email = jwtUtil.extractEmail(token);
                    String role  = jwtUtil.extractRole(token);

                    System.out.println("Token valid for: " + email + " role: " + role);

                    // ✅ Avoid setting auth again if already present
                    if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                        // ✅ Add ROLE_ prefix (IMPORTANT)
                        var authorities = List.of(
                                new SimpleGrantedAuthority("ROLE_" + role)
                        );

                        // ✅ Create authentication object
                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(
                                        email,
                                        null,
                                        authorities
                                );

                        // ✅ Attach request details
                        auth.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                        );

                        // ✅ Set authentication in context
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }

                } else {
                    System.out.println("Token invalid!");
                }

            } catch (Exception e) {
                System.out.println("Token error: " + e.getMessage());
            }
        } else {
            System.out.println("No Bearer token found!");
        }

        // ✅ Continue filter chain
        chain.doFilter(request, response);
    }
}