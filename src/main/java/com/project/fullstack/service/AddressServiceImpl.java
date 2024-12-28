package com.project.fullstack.service;

import com.project.fullstack.model.Address;
import com.project.fullstack.model.User;
import com.project.fullstack.repository.AddressRepository;
import com.project.fullstack.repository.UserRepository;
import com.project.fullstack.service.AddressService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Address createAddress(Long userId, Address addressDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Address address = new Address();
        address.setStreet(addressDetails.getStreet());
        address.setCity(addressDetails.getCity());
        address.setState(addressDetails.getState());
        address.setPincode(addressDetails.getPincode());
        address.setMobile(addressDetails.getMobile());
        address.setUserId(userId); // Set the User entity instead of just userId

        return addressRepository.save(address);
    }


    @Override
    public Address getAddressByUserId(Long userId) {
        return addressRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Address not found for User ID: " + userId));
    }


    @Override
    public Address updateAddress(Long userId, Address updatedAddress) {
        Address existingAddress = addressRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Address not found for User ID: " + userId));

        existingAddress.setStreet(updatedAddress.getStreet());
        existingAddress.setCity(updatedAddress.getCity());
        existingAddress.setState(updatedAddress.getState());
        existingAddress.setPincode(updatedAddress.getPincode());
        existingAddress.setMobile(updatedAddress.getMobile());

        return addressRepository.save(existingAddress);
    }




    @Transactional
    public void deleteAddressByUserId(Long userId) {
        System.out.println("Checking existence of addresses for user ID: " + userId);
        if (!addressRepository.existsByUserId(userId)) {
            throw new EntityNotFoundException("No addresses found for user ID: " + userId);
        }
        System.out.println("Deleting addresses for user ID: " + userId);
        addressRepository.deleteByUserId(userId);
        System.out.println("Successfully deleted addresses for user ID: " + userId);
    }


}
