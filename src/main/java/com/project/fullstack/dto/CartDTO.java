package com.project.fullstack.dto;

import java.util.List;

public class CartDTO {
    private Long id;
    private Long userId;
    private List<CartItemDTO> cartItems;
    private double totalPrice;
    private int totalItems;

    public CartDTO(Long id, Long userId, List<CartItemDTO> cartItems, double totalPrice, int totalItems) {
        this.id = id;
        this.userId = userId;
        this.cartItems = cartItems;
        this.totalPrice = totalPrice;
        this.totalItems = totalItems;
    }

    public CartDTO() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<CartItemDTO> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItemDTO> cartItems) {
        this.cartItems = cartItems;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }


// Getters and setters
}
