package com.project.fullstack.controller;

import com.project.fullstack.dto.ErrorResponse;
import com.project.fullstack.dto.OrderDTO;
import com.project.fullstack.exception.OrderException;
import com.project.fullstack.service.OrderService;
import jakarta.persistence.OptimisticLockException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/auth")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Create a new order (including order items)
    @PostMapping("/orders/create")
    public ResponseEntity<Object> createOrders(@Valid @RequestBody List<OrderDTO> orderDTOs) {
        try {
            List<OrderDTO> createdOrders = orderDTOs.stream()
                    .map(orderService::createOrder)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(createdOrders, HttpStatus.CREATED);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse("Unexpected error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    // Get a specific order by its ID

    @GetMapping("/orders/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByUserId(@PathVariable Long userId) {
        try {
            List<OrderDTO> orders = orderService.getOrdersByUserId(userId);
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (OrderException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    // Get all orders
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Update the order status (Confirmed, Shipped, Delivered, etc.)
    @PatchMapping("/orders/{orderId}/status")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        try {
            OrderDTO updatedOrder = orderService.updateOrderStatus(orderId, status);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (OrderException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // Delete an order by its ID
    @DeleteMapping("/orders/delete/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        try {
            orderService.deleteOrder(orderId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (OrderException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
