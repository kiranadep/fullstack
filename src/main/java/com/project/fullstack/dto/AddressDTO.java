package com.project.fullstack.dto;

public class AddressDTO {
    private Long id;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private String mobile;

    public AddressDTO(Long id, String street, String city, String state, String pincode, String mobile) {
        this.id = id;
        this.street = street;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.mobile = mobile;
    }

    public AddressDTO() {

    }

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
// Constructors, Getters, and Setters...
}
