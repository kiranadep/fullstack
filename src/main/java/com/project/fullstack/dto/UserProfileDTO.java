package com.project.fullstack.dto;

import java.util.List;

public class UserProfileDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String mobile;
    private List<AddressDTO> addresses;

    public UserProfileDTO() {
    }

    public UserProfileDTO(Long id, String firstName, String lastName, String email, String role, String mobile, List<AddressDTO> addresses) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.mobile = mobile;
        this.addresses = addresses;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public List<AddressDTO> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<AddressDTO> addresses) {
        this.addresses = addresses;
    }
    // Constructors, Getters, and Setters...
}
