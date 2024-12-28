package com.project.fullstack.productDTO;

import com.project.fullstack.model.Product;

public class ProductDTO {

    private Long id;
    private String name;
    private Double price;
    private String description; // New field
    private String size;        // New field
    private String imagePath;
    private Long categoryId;
    private String categoryName; // Added field for category name

    // Default constructor
    public ProductDTO() {}

    // Constructor from Product entity
    public ProductDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.price = product.getPrice();
        this.description = product.getDescription();
        this.size = product.getSize();
        this.imagePath = product.getImagePath();
        this.categoryId = product.getCategory().getId();
        this.categoryName = product.getCategory().getName(); // Get category name from Category entity
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
