package com.project.fullstack.service;

import com.project.fullstack.model.User;
import com.project.fullstack.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    // Constructor for dependency injection
    public CustomUserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Fetch user from the database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Add "ROLE_" prefix to the user's role
        String role = user.getRole(); // Add ROLE_ prefix

        // Map role to GrantedAuthority
        GrantedAuthority authority = new SimpleGrantedAuthority(role);

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), Collections.singletonList(authority));
    }
}
