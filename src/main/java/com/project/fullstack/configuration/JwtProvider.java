package com.project.fullstack.configuration;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

@Service
public class JwtProvider {

    private final SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

    /**
     * Generate JWT token for the authenticated user.
     *
     * @param auth the authentication object containing user details.
     * @return a signed JWT.
     */
    public String generateToken(Authentication auth) {
        // Extract email (username) and roles
        String email = auth.getName();
        String roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(authority -> {
                    if (!authority.startsWith("ROLE_")) {
                        return "ROLE_" + authority;
                    }
                    return authority;
                })
                .collect(Collectors.joining(",")); // Comma-separated roles

        return Jwts.builder()
                .setSubject("user-details")
                .claim("email", email)
                .claim("authorities", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 1-hr expiration
                .signWith(key)
                .compact();
    }

    /**
     * Extract email (or username) from the JWT token.
     *
     * @param jwt the JWT token.
     * @return the email extracted from the token.
     */
    public String getEmailFromToken(String jwt) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt.startsWith("Bearer ") ? jwt.substring(7) : jwt)
                .getBody();
        return claims.get("email", String.class);
    }

    /**
     * Validate JWT token.
     *
     * @param token the JWT token.
     * @return true if the token is valid, false if expired.
     */
    public boolean validateToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token.startsWith("Bearer ") ? token.substring(7) : token)
                    .getBody();
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
