package com.project.fullstack.service;

import com.project.fullstack.exception.ProdutctException;
import com.project.fullstack.model.Review;
import com.project.fullstack.model.User;
import com.project.fullstack.request.ReviewRequest;

import java.util.List;

public interface ReviewService {

    public Review createReview(ReviewRequest req, User user) throws ProdutctException;
    public List<Review> getAllReview(Long productId);
}
