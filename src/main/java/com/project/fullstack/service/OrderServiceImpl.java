package com.project.fullstack.service;

import com.project.fullstack.model.Order;
import com.project.fullstack.model.OrderItem;
import com.project.fullstack.exception.OrderException;
import com.project.fullstack.repository.OrderRepository;
import com.project.fullstack.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    // Method to create an order and save order items
    @Override
    public Order createOrder(Order order) {
        // Save the order first
        Order savedOrder = orderRepository.save(order);

        // Save order items
        for (OrderItem item : order.getOrderitems()) {
            item.setOrder(savedOrder); // Associate the order item with the saved order
            orderItemRepository.save(item);
        }

        return savedOrder;
    }

    // Method to find an order by its ID
    @Override
    public Order findOrderById(Long orderId) throws OrderException {
        return orderRepository.findById(orderId).orElseThrow(() -> new OrderException("Order not found"));
    }

    // Method to get all orders
    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Method to update the status of an order (e.g., 'Confirmed', 'Shipped', 'Delivered')
    @Override
    public Order updateOrderStatus(Long orderId, String status) throws OrderException {
        Order order = findOrderById(orderId);
        order.setOrderStatus(status);
        return orderRepository.save(order);
    }

    // Method to delete an order
    @Override
    public void deleteOrder(Long orderId) throws OrderException {
        Order order = findOrderById(orderId);
        orderRepository.delete(order);
    }
}
