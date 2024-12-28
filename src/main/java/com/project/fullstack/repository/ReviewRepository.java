package com.project.fullstack.repository;

import com.project.fullstack.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("Select r From Review r where r.product.id=:productid")
    public List<Review> getAllProductsReview(@Param("productid")Long productId);
}
