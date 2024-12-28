package com.project.fullstack.repository;

import com.project.fullstack.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Custom query methods can be added here if needed
}
