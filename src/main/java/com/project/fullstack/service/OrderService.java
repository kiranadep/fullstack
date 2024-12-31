package com.project.fullstack.service;

import com.project.fullstack.dto.OrderDTO;
import com.project.fullstack.dto.OrderItemDTO;
import com.project.fullstack.exception.OrderException;

import java.util.List;

public interface OrderService {
    // Method to create an order

    List<OrderDTO> getOrdersByUserId(Long userId) throws OrderException;

    // Create Order using OrderDTO
    OrderDTO createOrder(OrderDTO orderDTO) throws OrderException;

    // Method to find an order by ID
    OrderDTO findOrderById(Long orderId) throws OrderException;

    // Method to get all orders
    List<OrderDTO> getAllOrders();

    // Method to update order status (e.g., 'Confirmed', 'Shipped', 'Delivered')
    OrderDTO updateOrderStatus(Long orderId, String status) throws OrderException;

    // Method to delete an order by ID
    void deleteOrder(Long orderId) throws OrderException;


    OrderItemDTO addOrderItemToOrder(Long orderId, OrderItemDTO orderItemDTO) throws OrderException;
    List<OrderItemDTO> getOrderItems(Long orderId) throws OrderException;
    OrderItemDTO updateOrderItem(Long orderId, Long orderItemId, OrderItemDTO orderItemDTO) throws OrderException;
    void deleteOrderItem(Long orderId, Long orderItemId) throws OrderException;
}
