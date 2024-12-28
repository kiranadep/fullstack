package com.project.fullstack.repository;

import com.project.fullstack.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Find category by name
    Optional<Category> findByName(String categoryName);

    // Case-insensitive search by name
    @Query("SELECT c FROM Category c WHERE LOWER(c.name) = LOWER(:categoryName)")
    Optional<Category> findByNameIgnoreCase(@Param("categoryName") String categoryName);

    // Find all categories sorted by name
    List<Category> findAllByOrderByNameAsc();
}
