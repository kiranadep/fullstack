package com.project.fullstack.service;

import com.project.fullstack.exception.ProdutctException;
import com.project.fullstack.model.Product;
import com.project.fullstack.model.Rating;
import com.project.fullstack.model.User;
import com.project.fullstack.repository.RatingRepository;
import com.project.fullstack.request.RatingRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RatingServiceImpl implements RatingService{
    private RatingRepository ratingRepository;
    private ProductService productService;

    public RatingServiceImpl(RatingRepository ratingRepository, ProductService productService) {
        this.ratingRepository = ratingRepository;
        this.productService = productService;
    }

    @Override
    public Rating crateRating(RatingRequest req, User user) throws ProdutctException {
        Product product = productService.findProductById(req.getProductId());
        Rating rating = new Rating();
        rating.setProduct(product);
        rating.setProduct(product);
        rating.setUser(user);
        rating.setRating(req.getRating());
        rating.setCreatedAt(LocalDateTime.now());
        return ratingRepository.save(rating);
    }

    @Override
    public List<Rating> getProductRating(Long productId) {

        return ratingRepository.getAllProductsRating(productId);
    }
}
