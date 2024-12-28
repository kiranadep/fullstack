package com.project.fullstack.service;

import com.project.fullstack.model.Category;
import com.project.fullstack.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Save or update a category
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Retrieve all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Delete category by ID
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category with ID " + id + " not found.");
        }
        categoryRepository.deleteById(id);
    }

    // Find category by ID
    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category with ID " + id + " not found."));
    }

    // Find category by name
    public Category findByName(String categoryName) {
        return categoryRepository.findByName(categoryName)
                .orElseThrow(() -> new ResourceNotFoundException("Category with name '" + categoryName + "' not found."));
    }
    public Category updateCategory(Long id, Category category) throws ResourceNotFoundException {
        // Check if the category exists in the database
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category with id " + id + " not found"));

        // Update the category fields
        existingCategory.setName(category.getName());
        // If there are other fields, update them similarly
        // For example, if there is a description:
        // existingCategory.setDescription(category.getDescription());

        // Save the updated category back to the database
        return categoryRepository.save(existingCategory);
    }
}
