package com.project.fullstack.service;

import com.project.fullstack.dto.CartDTO;
import com.project.fullstack.exception.CartException;
import com.project.fullstack.exception.UserException;
import com.project.fullstack.model.Cart;
import jdk.jshell.spi.ExecutionControl;

public interface CartService {
    Cart getCartEntityByUserId(Long userId) throws CartException; // Return Cart entity for internal usage
    CartDTO getCartDTOByUserId(Long userId) throws CartException; // Return CartDTO for API response
    CartDTO addCartItem(Long userId, Long productId, String size, int quantity) throws CartException, ExecutionControl.UserException, UserException;
    CartDTO removeCartItem(Long userId, Long cartItemId) throws CartException;

    Cart getCartByUserId(Long userId);
}




