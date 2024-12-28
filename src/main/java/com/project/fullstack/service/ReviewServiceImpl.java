package com.project.fullstack.service;

import com.project.fullstack.exception.ProdutctException;
import com.project.fullstack.model.Product;
import com.project.fullstack.model.Review;
import com.project.fullstack.model.User;
import com.project.fullstack.repository.ProductRepository;
import com.project.fullstack.repository.ReviewRepository;
import com.project.fullstack.request.ReviewRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService{
    private ReviewRepository reviewRepository;
    private ProductService productService;
    private ProductRepository productRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, ProductService productService, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productService = productService;
        this.productRepository = productRepository;
    }



    public ReviewRepository getReviewRepository() {

        return reviewRepository;
    }

    public void setReviewRepository(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public ProductService getProductService() {
        return productService;
    }

    public void setProductService(ProductService productService) {
        this.productService = productService;
    }

    public ProductRepository getProductRepository() {
        return productRepository;
    }

    public void setProductRepository(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Review createReview(ReviewRequest req, User user) throws ProdutctException {
        Product product = productService.findProductById(req.getProductId());

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setReview(req.getReview());
        review.setCreateAt(LocalDateTime.now());


        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getAllReview(Long productId) {

        return reviewRepository.getAllProductsReview(productId);
    }
}
