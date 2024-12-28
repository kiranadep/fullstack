package com.project.fullstack.service;

import com.project.fullstack.exception.CategoryNotFoundException;
import com.project.fullstack.exception.ProductNotFoundException;
import com.project.fullstack.model.Category;
import com.project.fullstack.model.Product;
import com.project.fullstack.productDTO.ProductDTO;
import com.project.fullstack.repository.CategoryRepository;
import com.project.fullstack.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    // Get all products
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(ProductDTO::new).collect(Collectors.toList());
    }

    // Find product by ID
    public Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found for ID: " + id));
    }

    // Get product by ID (as DTO)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        return new ProductDTO(product);
    }

    // Save new product
    public Product saveProduct(ProductDTO productDTO) {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        Product product = new Product();
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setDescription(productDTO.getDescription()); // New field
        product.setSize(productDTO.getSize());               // New field
        product.setImagePath(productDTO.getImagePath());
        product.setCategory(category);

        return productRepository.save(product);
    }

    // Update product
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        existingProduct.setName(productDTO.getName());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setDescription(productDTO.getDescription()); // Update description
        existingProduct.setSize(productDTO.getSize());               // Update size
        existingProduct.setImagePath(productDTO.getImagePath());

        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        existingProduct.setCategory(category);

        productRepository.save(existingProduct);
        return new ProductDTO(existingProduct);
    }

    // Delete product
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        productRepository.delete(product);
    }

    // Get products by category IDs
    public List<ProductDTO> getProductsByCategories(List<Long> categoryIds) {
        List<Product> products = productRepository.findByCategoryIdIn(categoryIds);
        return products.stream().map(ProductDTO::new).collect(Collectors.toList());
    }
}
