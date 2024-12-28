package com.project.fullstack.service;

import com.project.fullstack.model.Order;
import com.project.fullstack.exception.OrderException;

import java.util.List;

public interface OrderService {
    // Method to create an order
    Order createOrder(Order order);

    // Method to find an order by ID
    Order findOrderById(Long orderId) throws OrderException;

    // Method to get all orders
    List<Order> getAllOrders();

    // Method to update order status (e.g., 'Confirmed', 'Shipped', 'Delivered')
    Order updateOrderStatus(Long orderId, String status) throws OrderException;

    // Method to delete an order by ID
    void deleteOrder(Long orderId) throws OrderException;
}
