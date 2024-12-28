package com.project.fullstack.service;

import com.project.fullstack.model.Address;

public interface AddressService {
    Address createAddress(Long userId, Address address);
    Address getAddressByUserId(Long userId);
    Address updateAddress(Long userId, Address updatedAddress);
    void deleteAddressByUserId(Long userId);
}
