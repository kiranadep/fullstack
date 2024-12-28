package com.project.fullstack.service;


import com.project.fullstack.exception.ProdutctException;
import com.project.fullstack.model.Rating;
import com.project.fullstack.model.User;
import com.project.fullstack.request.RatingRequest;

import java.util.List;

public interface RatingService {
    public Rating crateRating(RatingRequest req, User user ) throws ProdutctException;
    public List<Rating> getProductRating(Long productId);
}
