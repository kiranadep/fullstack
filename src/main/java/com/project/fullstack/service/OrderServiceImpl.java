package com.project.fullstack.service;

import com.project.fullstack.dto.OrderDTO;
import com.project.fullstack.dto.OrderItemDTO;
import com.project.fullstack.exception.OrderException;
import com.project.fullstack.model.Order;
import com.project.fullstack.model.OrderItem;
import com.project.fullstack.repository.OrderItemRepository;
import com.project.fullstack.repository.OrderRepository;
import com.project.fullstack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository, OrderItemRepository orderItemRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<OrderDTO> getOrdersByUserId(Long userId) throws OrderException {
        System.out.println("Fetching orders for user ID: " + userId); // Debugging log
        List<Order> orders = orderRepository.findOrdersByUserId(userId);
        if (orders.isEmpty()) {
            throw new OrderException("No orders found for user ID: " + userId);
        }
        return orders.stream()
                .map(this::toOrderDTO)
                .collect(Collectors.toList());
    }


    // Create Order using OrderDTO

    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {
        // Map DTO to Order entity
        Order order = new Order();
        order.setUser(userRepository.findById(orderDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found")));
        order.setOrderDate(String.valueOf(orderDTO.getOrderDate()));
        order.setDeliveryDate(String.valueOf(orderDTO.getDeliveryDate()));
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setTotalPrice(orderDTO.getTotalPrice());
        order.setOrderStatus(orderDTO.getOrderStatus());
        order.setTotalItem(orderDTO.getTotalItem());

        // Save the Order first to ensure it gets an ID
        Order savedOrder = orderRepository.save(order);

        // Map and attach OrderItems
        List<OrderItem> orderItems = orderDTO.getOrderItems().stream()
                .map(itemDTO -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setProductId(itemDTO.getProductId());
                    orderItem.setQuantity(itemDTO.getQuantity());
                    orderItem.setPrice(itemDTO.getPrice());
                    orderItem.setOrder(savedOrder); // Set reference to the saved Order
                    return orderItem;
                }).collect(Collectors.toList());

        // Save all OrderItems
        orderItemRepository.saveAll(orderItems);

        // Update the Order with its items and return DTO
        savedOrder.setOrderItems(orderItems);
        return toOrderDTO(savedOrder);
    }



    // Find Order by ID and return OrderDTO
    @Override
    public OrderDTO findOrderById(Long orderId) throws OrderException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException("Order not found"));
        return toOrderDTO(order);
    }

    // Get all Orders as a list of OrderDTOs
    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toOrderDTO)
                .collect(Collectors.toList());
    }

    // Update Order Status
    @Override
    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, String status) throws OrderException {
        try {
            // Retrieve the order from the database again to ensure the version is correct
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new OrderException("Order not found"));

            // Update order status
            order.setOrderStatus(status);

            // Save the updated order. This will trigger optimistic locking checks
            Order updatedOrder = orderRepository.save(order);

            return toOrderDTO(updatedOrder);

        } catch (ObjectOptimisticLockingFailureException e) {
            // Handle optimistic locking failure (if another user modified the order)
            throw new OrderException("The order was modified by another user. Please refresh and try again.");
        } catch (Exception e) {
            // Catch all other exceptions
            throw new OrderException("Error updating the order: " + e.getMessage());
        }
    }


    // Delete Order
    @Override
    public void deleteOrder(Long orderId) throws OrderException {
        Order order = findOrderByIdEntity(orderId); // Reuse internal method to get Order entity
        orderRepository.delete(order);
    }

    // Add Order Item to an Existing Order
    @Override
    @Transactional
    public OrderItemDTO addOrderItemToOrder(Long orderId, OrderItemDTO orderItemDTO) throws OrderException {
        Order order = findOrderByIdEntity(orderId);  // Fetch the existing order

        // Create the OrderItem entity
        OrderItem orderItem = new OrderItem();
        orderItem.setProductId(orderItemDTO.getProductId());
        orderItem.setQuantity(orderItemDTO.getQuantity());
        orderItem.setPrice(orderItemDTO.getPrice());
        orderItem.setOrder(order);  // Associate it with the current order

        // Save the OrderItem
        orderItemRepository.save(orderItem);

        // Add the new item to the order's item list and update the order if necessary
        order.getOrderItems().add(orderItem);
        order.setTotalItem(order.getTotalItem() + 1);  // Optionally update the total item count
        order.setTotalPrice(order.getTotalPrice() + orderItem.getPrice());  // Optionally update the total price

        // Save the updated order
        orderRepository.save(order);

        return toOrderItemDTO(orderItem);  // Return the DTO of the added item
    }

    // Get all Order Items for a specific Order
    @Override
    public List<OrderItemDTO> getOrderItems(Long orderId) throws OrderException {
        Order order = findOrderByIdEntity(orderId);  // Fetch the existing order

        return order.getOrderItems().stream()
                .map(this::toOrderItemDTO)  // Convert each OrderItem to OrderItemDTO
                .collect(Collectors.toList());
    }

    // Update Order Item
    @Override
    public OrderItemDTO updateOrderItem(Long orderId, Long orderItemId, OrderItemDTO orderItemDTO) throws OrderException {
        // Implementation for updating an order item can be added here
        return null;
    }

    // Delete Order Item
    @Override
    public void deleteOrderItem(Long orderId, Long orderItemId) throws OrderException {
        // Implementation for deleting an order item can be added here
    }

    // Private method to find Order entity by ID
    private Order findOrderByIdEntity(Long orderId) throws OrderException {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException("Order not found"));
    }

    // Convert Order to OrderDTO
    private OrderDTO toOrderDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderid(order.getOrderid());
        dto.setUserId(order.getUser().getId());
        dto.setOrderDate(LocalDateTime.parse(order.getOrderDate()));
        dto.setDeliveryDate(LocalDateTime.parse(order.getDeliveryDate()));
        dto.setShippingAddress(order.getShippingAddress());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setTotalItem(order.getTotalItem());
        dto.setOrderItems(order.getOrderItems().stream()
                .map(this::toOrderItemDTO)
                .collect(Collectors.toList()));
        return dto;
    }

    // Convert OrderItem to OrderItemDTO
    private OrderItemDTO toOrderItemDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setProductId(item.getProductId());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        return dto;
    }
}
