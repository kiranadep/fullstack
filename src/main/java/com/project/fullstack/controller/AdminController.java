package com.project.fullstack.controller;

import com.project.fullstack.configuration.JwtProvider;
import com.project.fullstack.exception.ProductNotFoundException;
import com.project.fullstack.exception.ResourceNotFoundException;
import com.project.fullstack.exception.UserException;
import com.project.fullstack.model.Category;
import com.project.fullstack.model.Product;
import com.project.fullstack.model.User;
import com.project.fullstack.productDTO.ProductDTO;
import com.project.fullstack.repository.UserRepository;
import com.project.fullstack.request.LoginRequest;
import com.project.fullstack.service.*;
import com.project.fullstack.response.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final CategoryService categoryService;
    private final ProductService productService;
    private UserRepository userRepository;
    private JwtProvider jwtProvider;
    private PasswordEncoder passwordEncoder;
    private CustomUserServiceImpl customUserService;
    private final UserServiceImpl userServiceImpl;
    @Autowired
    public AdminController(CategoryService categoryService, ProductService productService, UserRepository userRepository, JwtProvider jwtProvider, PasswordEncoder passwordEncoder, CustomUserServiceImpl customUserService, UserService userService, UserServiceImpl userServiceImpl) {
        this.categoryService = categoryService;
        this.productService = productService;
        this.userRepository = userRepository;
        this.jwtProvider = jwtProvider;
        this.passwordEncoder = passwordEncoder;
        this.customUserService = customUserService;

        this.userServiceImpl = userServiceImpl;
    }
//      Authentication
//    admin
// Make sure UserServiceImpl is injected here



    //    Signup
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws UserException {
        // Validate the request data
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Email and Password are required"));
        }

        String email = user.getEmail();
        String password = user.getPassword();
        String firstName = user.getFirstName();
        String lastName = user.getLastName();

        // Check if the email already exists
        User existingUser = userRepository.findByEmail(email).orElse(null);
        if (existingUser != null) {
            throw new UserException("Email is already registered with another account");
        }

        // Create the new user object
        User createdUser = new User();
        createdUser.setEmail(email);
        createdUser.setPassword(passwordEncoder.encode(password)); // Encrypt the password
        createdUser.setFirstName(firstName);
        createdUser.setLastName(lastName);

        // Check if an admin already exists, if not, assign "ADMIN" to the first user
        User existingAdmin = userRepository.findByRole("ROLE_ADMIN").orElse(null);
        if (existingAdmin == null) {
            createdUser.setRole("ROLE_ADMIN"); // Assign "ADMIN" to the first user
        } else {
            createdUser.setRole("ROLE_USER"); // Assign "USER" role to subsequent users
        }

        // Save the new user to the database
        User savedUser = userRepository.save(createdUser);

        // Perform authentication
        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(), savedUser.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        String token = jwtProvider.generateToken(authentication);

        // Create and return the response
        AuthResponse authResponse = new AuthResponse(token, "Signup Success");
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

//    Login
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> loginUserHandler(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse(token, "SignIn Successful");

        return new ResponseEntity<>(authResponse, HttpStatus.OK);  // Use HttpStatus.OK for successful login
    }

        private Authentication authenticate(String username, String password) {
            // Load user details by username
            UserDetails userDetails = customUserService.loadUserByUsername(username);
            if (userDetails == null) {
                throw new BadCredentialsException("Invalid Username...");
            }

            // Check if the provided password matches the stored one
            if (!passwordEncoder.matches(password, userDetails.getPassword())) {
                throw new BadCredentialsException("Invalid Password...");
            }

            // Authentication is successful, return a UsernamePasswordAuthenticationToken
            return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        }


//    Category

    // Get all categories
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories); // Return the list of categories
    }

    // Add a new category
    @PostMapping("/categories")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        try {
            Category newCategory = categoryService.saveCategory(category); // Call saveCategory
            return ResponseEntity.status(HttpStatus.CREATED).body(newCategory); // Return created category
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Return 500 if error occurs
        }
    }

    // Find category by ID
    @GetMapping("/categories/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        try {
            Category category = categoryService.findById(id);
            return ResponseEntity.ok(category); // Return category if found
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build(); // Return 404 if not found
        }
    }

    // Delete category by ID
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id); // Attempt to delete the category
            return ResponseEntity.noContent().build(); // Successful deletion, return 204
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build(); // Return 404 if not found
        }
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id,@RequestBody Category category) {
        try {
            Category existingCategory = categoryService.findById(id);
            existingCategory.setName(category.getName());// Call saveCategory
            Category updatedCategory = categoryService.saveCategory(existingCategory);
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedCategory); // Return created category
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Return 500 if error occurs
        }
    }


    // GET all products
//    @GetMapping("/products")
//    public List<ProductDTO> getAllProducts() {
//        List<Product> products = productService.getAllProducts();
//        return products.stream().map(ProductDTO::new).collect(Collectors.toList());
//    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO productDTO = productService.getProductById(id);
        return ResponseEntity.ok(productDTO);
    }



    @PostMapping("/products")
    public ResponseEntity<ProductDTO> saveProduct(
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("description") String description, // New field
            @RequestParam("size") String size,               // New field
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("imageFile") MultipartFile imageFile) throws IOException {

        // Handle image upload (save to a file system or DB)
        String imagePath = "F:/courses/java/projects/fullstack/uploaded/" + imageFile.getOriginalFilename();
        imageFile.transferTo(new java.io.File(imagePath));

        // Create a ProductDTO object
        ProductDTO productDTO = new ProductDTO();
        productDTO.setName(name);
        productDTO.setPrice(price);
        productDTO.setDescription(description); // Set description
        productDTO.setSize(size);               // Set size
        productDTO.setImagePath(imagePath);
        productDTO.setCategoryId(categoryId);

        // Save product using the service
        Product savedProduct = productService.saveProduct(productDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ProductDTO(savedProduct));
    }

    // PUT update a product
    @PutMapping("/products/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestParam("name") String name,
                                                    @RequestParam("price") Double price, @RequestParam("description") String description,
                                                    @RequestParam("size") String size, @RequestParam("categoryId") Long categoryId,
                                                    @RequestParam("imageFile") MultipartFile imageFile) throws IOException {

        // Handle image upload (save to file system or DB)
        String imagePath = "F:/courses/java/projects/fullstack/uploaded/" + imageFile.getOriginalFilename();
        imageFile.transferTo(new java.io.File(imagePath));

        // Create a ProductDTO object with updated data
        ProductDTO productDTO = new ProductDTO();
        productDTO.setName(name);
        productDTO.setPrice(price);
        productDTO.setDescription(description);
        productDTO.setSize(size);
        productDTO.setCategoryId(categoryId);
        productDTO.setImagePath(imagePath); // Update image path

        // Call service to update the product
        ProductDTO updatedProductDTO = productService.updateProduct(id, productDTO);

        // Return updated product as response
        return ResponseEntity.ok(updatedProductDTO);
    }


    // DELETE a product
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getProductsByCategories(@RequestParam(required = false) String category) {
        List<ProductDTO> productDTOList;

        if (category != null && !category.isEmpty()) {
            // Split the category string into individual category IDs
            String[] categoryIds = category.split(",");
            // Convert string array to a list of Longs (category IDs)
            List<Long> categoryIdList = Arrays.stream(categoryIds)
                    .map(Long::parseLong)
                    .collect(Collectors.toList());

            // Call the service method to get products by multiple categories
            productDTOList = productService.getProductsByCategories(categoryIdList);
        } else {
            // If no categories are provided, get all products
            productDTOList = productService.getAllProducts();
        }

        return ResponseEntity.ok(productDTOList);
    }



}
