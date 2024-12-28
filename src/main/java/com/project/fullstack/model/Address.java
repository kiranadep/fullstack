package com.project.fullstack.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

@Entity
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String street;
    private String city;
    private String state;
    private String pincode;
    private String mobile;

    @ManyToOne(fetch = FetchType.LAZY) // Many addresses can belong to one user
    @JoinColumn(name = "user_id", nullable = false, insertable = false, updatable = false) // Ensures user_id is used
    @JsonBackReference
    private User user;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    public Address() {
    }

    public Address(Long id, String street, String city, String state, String pincode, Long userId, String mobile, User user) {
        this.id = id;
        this.street = street;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.userId = userId;
        this.mobile = mobile;
        this.user = user;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
