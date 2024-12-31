package com.project.fullstack.repository;

import com.project.fullstack.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.orderid = :orderId")
    List<OrderItem> findItemsByOrderId(@Param("orderId") Long orderId);

    List<OrderItem> findByProductId(Long productId);
}
