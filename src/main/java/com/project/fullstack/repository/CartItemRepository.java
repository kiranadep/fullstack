package com.project.fullstack.repository;

import com.project.fullstack.model.CartItem;
import com.project.fullstack.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByCartIdAndProductIdAndSize(Long cartId, Long productId, String size); // Custom method
}
