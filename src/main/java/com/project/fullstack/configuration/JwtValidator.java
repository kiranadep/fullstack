package com.project.fullstack.configuration;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;
import java.util.Objects;

public class JwtValidator extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Get the request URI
        String requestURI = request.getRequestURI();

        // Bypass validation for public routes
        if (requestURI.startsWith("/auth/products") ||
                requestURI.startsWith("/auth/categories") ||
                requestURI.startsWith("/auth/signin") ||
                requestURI.startsWith("/auth/signup")) {
            // Skip validation and continue the filter chain
            filterChain.doFilter(request, response);
            return;
        }


        // Retrieve the Authorization header
        String authHeader = request.getHeader(JwtConstant.JWT_HEADER);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7); // Extract token

            try {
                // Decode the JWT using the secret key
                SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(jwt)
                        .getBody();

                // Debugging/logging: print parsed claims
                System.out.println("Parsed Claims: " + claims);

                // Extract required claims
                String email = claims.get("email", String.class);
                String authorities = claims.get("authorities", String.class);

                if (email != null && authorities != null) {
                    List<GrantedAuthority> auths = AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);
                    Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, auths);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }

            } catch (Exception e) {
                // Handle errors related to token parsing or validation
                System.err.println("JWT Validation Error: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid token: " + e.getMessage());
                return;
            }

        } else if (authHeader == null) {
            System.err.println("Authorization header is missing");
        } else if (!authHeader.startsWith("Bearer ")) {
            System.err.println("Invalid Authorization header format: " + authHeader);
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }


}
