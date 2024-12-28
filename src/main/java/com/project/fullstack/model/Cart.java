package com.project.fullstack.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @Column(name = "cart_items")
    private Set<CartItem> cartItem = new HashSet<>();

    @Column(name = "total_price")
    private double totalPrice;

    @Column(name = "total_item")
    private int totalItem;

    // No-argument constructor (required by JPA and to fix your error)
    public Cart() {}

    // Constructor with all fields
    public Cart(Long id, User user, Set<CartItem> cartItem, double totalPrice, int totalItem) {
        this.id = id;
        this.user = user;
        this.cartItem = cartItem;
        this.totalPrice = totalPrice;
        this.totalItem = totalItem;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<CartItem> getCartItem() {
        return cartItem;
    }

    public void setCartItem(Set<CartItem> cartItem) {
        this.cartItem = cartItem;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public int getTotalItem() {
        return totalItem;
    }

    public void setTotalItem(int totalItem) {
        this.totalItem = totalItem;
    }
}
