package com.project.fullstack.service;

import com.project.fullstack.exception.UserException; // Correct import
import com.project.fullstack.model.User;
import com.project.fullstack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    public User assignAdminRole(Long userId) throws UserException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found"));

        user.setRole("ADMIN");
        return userRepository.save(user);
    }

    @Override
    public User findUserById(Long userId) throws UserException {  // Declare throws UserException
        return userRepository.findById(userId).orElseThrow(() -> new UserException("User not found"));
    }

    @Override
    public User findUserProfileByJwt(String jwt) {  // Declare throws UserException
        // Add logic for extracting user from JWT if needed
        return null;
    }

    @Override
    public User registerUser(User user) {
        // Check if an admin already exists
        Optional<User> existingAdmin = userRepository.findByRole("ADMIN");

        // Assign role as ROLE_ADMIN or ROLE_USER
        if (existingAdmin == null) {
            user.setRole("ADMIN");
        } else {
            user.setRole("USER");
        }

        // Save the user to the database
        return userRepository.save(user);
    }

}
