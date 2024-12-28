package com.project.fullstack.request;

public class AddItemRequest {
    private Long productId;
    private String size;
    private int quantity;

    public AddItemRequest(Long productId, String size, int quantity) {
        this.productId = productId;
        this.size = size;
        this.quantity = quantity;

    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }


}
