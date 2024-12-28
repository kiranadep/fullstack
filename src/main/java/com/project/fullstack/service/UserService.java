package com.project.fullstack.service;

import com.project.fullstack.exception.UserException;
import com.project.fullstack.model.User;
import jdk.jshell.spi.ExecutionControl;

public interface UserService {

    public User findUserById(Long userId) throws ExecutionControl.UserException, UserException;

    public User findUserProfileByJwt(String jwt) throws ExecutionControl.UserException;

    // New method to handle user registration
    public User registerUser(User user);
}
