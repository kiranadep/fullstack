package com.project.fullstack.repository;

import com.project.fullstack.model.Address;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByUserId(Long userId);
    // Custom query methods if needed
    boolean existsByUserId(Long userId);

    // Delete addresses associated with a user
    @Transactional
    void deleteByUserId(Long userId);

}
