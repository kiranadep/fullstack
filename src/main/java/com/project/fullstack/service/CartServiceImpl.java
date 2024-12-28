package com.project.fullstack.service;

import com.project.fullstack.dto.CartDTO;
import com.project.fullstack.dto.CartItemDTO;
import com.project.fullstack.exception.CartException;
import com.project.fullstack.exception.UserException;
import com.project.fullstack.model.Cart;
import com.project.fullstack.model.CartItem;
import com.project.fullstack.model.Product;
import com.project.fullstack.model.User;
import com.project.fullstack.repository.CartItemRepository;
import com.project.fullstack.repository.CartRepository;
import com.project.fullstack.repository.ProductRepository;
import jakarta.transaction.Transactional;
import jdk.jshell.spi.ExecutionControl;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository,
                           ProductRepository productRepository, UserService userService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }

    @Override
    public Cart getCartEntityByUserId(Long userId) throws CartException {
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            throw new CartException("Cart not found for user ID: " + userId);
        }
        return cart;
    }

    @Override
    public CartDTO getCartDTOByUserId(Long userId) throws CartException {
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            throw new CartException("Cart not found for user ID: " + userId);
        }
        return mapToDTO(cart);
    }

    @Override
    public CartDTO addCartItem(Long userId, Long productId, String size, int quantity)
            throws CartException, ExecutionControl.UserException, UserException {

        // Fetch or create the cart
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            cart = new Cart();
            User user = userService.findUserById(userId); // Fetch the user using the userService
            cart.setUser(user); // Set the user object
            cart.setTotalItem(0);
            cart.setTotalPrice(0.0);
            cart = cartRepository.save(cart);
        }

        // Fetch the product
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new CartException("Product not found with ID: " + productId);
        }
        Product product = productOpt.get();
        double unitPrice = product.getPrice(); // Ensure this is the correct unit price

        // Log unit price and quantity for debugging
        System.out.println("Product ID: " + productId);
        System.out.println("Unit Price: " + unitPrice);
        System.out.println("Quantity: " + quantity);

        // Check if the cart item already exists
        CartItem existingCartItem = cartItemRepository.findByCartIdAndProductIdAndSize(cart.getId(), productId, size);
        if (existingCartItem != null) {
            // Increment the quantity and recalculate the price
            int newQuantity = existingCartItem.getQuantity() + quantity;
            double newPrice = newQuantity * unitPrice; // Calculate new price
            System.out.println("Existing CartItem Price: " + existingCartItem.getPrice());
            System.out.println("Updated CartItem Price: " + newPrice);

            existingCartItem.setQuantity(newQuantity);
            existingCartItem.setPrice((int) newPrice); // Correct calculation
            cartItemRepository.save(existingCartItem);
        } else {
            // Add a new cart item
            double price = quantity * unitPrice; // Calculate price
            System.out.println("New CartItem Price: " + price);

            CartItem newCartItem = new CartItem();
            newCartItem.setCart(cart);
            newCartItem.setProduct(product);
            newCartItem.setQuantity(quantity);
            newCartItem.setSize(size);
            newCartItem.setPrice((int) price); // Correct calculation
            cartItemRepository.save(newCartItem);
        }

        // Update cart totals
        updateCartTotals(cart);

        return mapToDTO(cartRepository.save(cart)); // Return CartDTO after saving
    }


    @Transactional
    @Override
    public CartDTO removeCartItem(Long userId, Long cartItemId) throws CartException {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new CartException("CartItem not found with ID: " + cartItemId));
        Cart cart = cartItem.getCart();

        if (!cart.getUser().getId().equals(userId)) {
            throw new CartException("You can only remove items from your own cart.");
        }

        // Remove the cart item from the cart's collection
        cart.getCartItem().remove(cartItem);

        // Delete the cart item from the database
        cartItemRepository.delete(cartItem);

        // Update cart totals
        updateCartTotals(cart);

        // Save the cart after removing the reference to the deleted cart item
        cartRepository.save(cart);

        return mapToDTO(cart);
    }


    @Override
    public Cart getCartByUserId(Long userId) {
        return null;
    }

    private void updateCartTotals(Cart cart) {
        double totalPrice = 0;
        int totalItems = 0;

        for (CartItem item : cart.getCartItem()) {
            totalPrice += item.getPrice();
            totalItems += item.getQuantity();
        }

        cart.setTotalPrice(totalPrice);
        cart.setTotalItem(totalItems);
    }

    // Helper method to map Cart entity to CartDTO
    private CartDTO mapToDTO(Cart cart) {
        CartDTO cartDTO = new CartDTO();
        cartDTO.setId(cart.getId());
        cartDTO.setUserId(cart.getUser().getId());
        cartDTO.setTotalPrice(cart.getTotalPrice());
        cartDTO.setTotalItems(cart.getTotalItem()); // Ensure this matches your DTO class property

        List<CartItemDTO> cartItemDTOs = cart.getCartItem().stream()
                .map(item -> {
                    // Calculate price by multiplying unit price with quantity
                    double price = item.getProduct().getPrice() * item.getQuantity();
                    return new CartItemDTO(item.getId(), item.getProduct().getId(), item.getProduct().getName(),
                            item.getQuantity(), item.getSize(), item.getProduct().getPrice());  // Add price here
                })
                .collect(Collectors.toList());

        cartDTO.setCartItems(cartItemDTOs);
        return cartDTO;
    }


}
