package com.project.fullstack.dto;

public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private int quantity;
    private String size;
    private double price;
    private String imagePath;

    public CartItemDTO(Long id, Long productId, String productName,String imagePath, int quantity, String size, double price) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.imagePath = imagePath;
        this.quantity = quantity;
        this.size = size;
        this.price = price;
    }
    public CartItemDTO(){

    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }



    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }
    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

// Getters and setters
}
