package com.project.fullstack.controller;

import com.project.fullstack.dto.AddressDTO;
import com.project.fullstack.dto.CartDTO;
import com.project.fullstack.dto.CartItemDTO;
import com.project.fullstack.dto.UserProfileDTO;
import com.project.fullstack.exception.CartException;
import com.project.fullstack.exception.InvalidTokenException;
import com.project.fullstack.exception.UserException;
import com.project.fullstack.model.Address;
import com.project.fullstack.model.User;
import com.project.fullstack.repository.AddressRepository;
import com.project.fullstack.repository.UserRepository;
import com.project.fullstack.service.AddressService;
import com.project.fullstack.service.CartService;
import com.project.fullstack.service.UserService;
import com.project.fullstack.configuration.JwtProvider;  // Import JwtProvider
import jakarta.persistence.EntityNotFoundException;
import jdk.jshell.spi.ExecutionControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class UserController {

    private final CartService cartService;
    private final UserService userService;
    private final JwtProvider jwtProvider; // Inject JwtProvider
    private final UserRepository userRepository;
    private final AddressService addressService;
    private final AddressRepository addressRepository;
    public UserController(CartService cartService, UserService userService, JwtProvider jwtProvider, UserRepository userRepository, AddressService addressService, AddressRepository addressRepository) {
        this.cartService = cartService;
        this.userService = userService;
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
        this.addressService = addressService;
        this.addressRepository = addressRepository;
    }

// Address-related endpoints

    // Create a new address for a user
    @PostMapping(value = "/address/{userId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Address> createAddress(@PathVariable Long userId, @RequestBody Address addressDetails) {
        Address createdAddress = addressService.createAddress(userId, addressDetails);
        return ResponseEntity.ok(createdAddress);
    }


    // Get an address by user ID
    @GetMapping("/address/{userId}")
    public ResponseEntity<?> getAddressByUserId(@PathVariable Long userId) {
        try {
            Address address = addressService.getAddressByUserId(userId);
            return ResponseEntity.ok(address);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error fetching address: " + e.getMessage());
        }
    }

    // Update an address for a user
    @PutMapping("/address/{userId}")
    public ResponseEntity<?> updateAddress(@PathVariable Long userId, @RequestBody Address updatedAddress) {
        try {
            Address address = addressService.updateAddress(userId, updatedAddress);
            return ResponseEntity.ok(address);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating address: " + e.getMessage());
        }
    }

    // Delete an address by user ID
    @DeleteMapping("/address/{userId}")
    public ResponseEntity<?> deleteAddressByUserId(@PathVariable Long userId) {
        try {
            addressService.deleteAddressByUserId(userId);
            return ResponseEntity.ok("Address deleted successfully for user ID: " + userId);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error deleting address: " + e.getMessage());
        }
    }




    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile() throws UserException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserException("User not found"));

        List<AddressDTO> addressDTOs = user.getAddresses().stream().map(address -> {
            AddressDTO dto = new AddressDTO();
            dto.setId(address.getId());
            dto.setStreet(address.getStreet());
            dto.setCity(address.getCity());
            dto.setState(address.getState());
            dto.setPincode(address.getPincode());
            dto.setMobile(address.getMobile());
            return dto;
        }).toList();

        UserProfileDTO response = new UserProfileDTO();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setMobile(user.getMobile());
        response.setAddresses(addressDTOs);

        return ResponseEntity.ok(response);
    }


    // Update user profile
    @PutMapping("/profile")
    public ResponseEntity<Object> updateUserProfile(@RequestBody User updatedUser) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            User existingUser = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UserException("User not found"));

            // Update fields based on the incoming request
            if (updatedUser.getFirstName() != null) {
                existingUser.setFirstName(updatedUser.getFirstName());
            }
            if (updatedUser.getLastName() != null) {
                existingUser.setLastName(updatedUser.getLastName());
            }
            if (updatedUser.getMobile() != null) {
                existingUser.setMobile(updatedUser.getMobile());
            }
            if (updatedUser.getEmail() != null) {
                existingUser.setEmail(updatedUser.getEmail());
            }
            // You can add more fields as needed, except sensitive ones like email/password.

            // Save the updated user in the database
            User savedUser = userRepository.save(existingUser);

            var response = new Object() {
                public final Long id = savedUser.getId();
                public final String firstName = savedUser.getFirstName();
                public final String lastName = savedUser.getLastName();
                public final String email = savedUser.getEmail();
                public final String role = savedUser.getRole();
                public final String mobile = savedUser.getMobile();
//                public final List<Address> addressList = Address
                public final LocalDateTime createdAt = savedUser.getCreatedAt();
            };

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating profile: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/cart/{userId}")
    public ResponseEntity<CartDTO> getCartByUserId(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String authHeader) throws CartException, InvalidTokenException {

        // Extract the token from the Authorization header
        String token = authHeader.substring(7); // Removing "Bearer " prefix

        // Validate token here (or use the JwtUtil class you mentioned earlier)
        if (!jwtProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Get the cart data
        CartDTO cartDTO = cartService.getCartDTOByUserId(userId);

        return ResponseEntity.ok(cartDTO);
    }


    @PostMapping("/cart/{userId}/add")
    public ResponseEntity<CartDTO> addCartItem(@PathVariable Long userId,
                                               @RequestBody CartItemDTO cartItemDTO,
                                               @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);  // Extract the token

        // Validate the token
        if (!jwtProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);  // Return 401 if the token is invalid
        }

        try {
            // Add item to cart
            CartDTO updatedCart = cartService.addCartItem(userId, cartItemDTO.getProductId(), cartItemDTO.getSize(), cartItemDTO.getQuantity());
            return new ResponseEntity<>(updatedCart, HttpStatus.OK);
        } catch (CartException | UserException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);  // Handle cart-related errors
        } catch (ExecutionControl.UserException e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/cart/{userId}/remove/{cartItemId}")
    public ResponseEntity<CartDTO> removeCartItem(@PathVariable Long userId, @PathVariable Long cartItemId) {
        try {
            CartDTO cart = cartService.removeCartItem(userId, cartItemId);
            return ResponseEntity.ok(cart);
        } catch (CartException e) {
            return ResponseEntity.badRequest().body(null);  // Handle removal errors
        }
    }
}
