package com.project.fullstack.repository;

import com.project.fullstack.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Custom query methods can be added here if needed
}
