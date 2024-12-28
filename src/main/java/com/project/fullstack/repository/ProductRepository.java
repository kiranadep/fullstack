package com.project.fullstack.repository;

import com.project.fullstack.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p " +
            "WHERE (:category IS NULL OR p.category.name = :category) " +
            "AND ((:minPrice IS NULL AND :maxPrice IS NULL) " +
            "     OR (p.price BETWEEN :minPrice AND :maxPrice)) " +
            "ORDER BY " +
            "CASE WHEN :sort = 'price_low' THEN p.price END ASC, " +
            "CASE WHEN :sort = 'price_high' THEN p.price END DESC")
    List<Product> filterProducts(@Param("category") String category,
                                 @Param("minPrice") Double minPrice,
                                 @Param("maxPrice") Double maxPrice,
                                 @Param("sort") String sort);
    List<Product> findByCategoryId(Long categoryId);


    List<Product> findByCategoryIdIn(List<Long> categoryIds);

}
