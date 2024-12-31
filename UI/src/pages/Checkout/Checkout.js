import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserDetails, updateAddressAPI, deleteAddressAPI } from "../../api/userInfo";
import { setLoading } from "../../store/features/common";
import { useNavigate, useLocation } from "react-router-dom";
import AddAddress from "../Account/AddAddress";
import axios from "axios"; // Import axios for API requests
import { API_BASE_URL, getHeaders } from "../../api/constant";
import { getToken } from '../../utils/jwt-helper';
const Checkout = () => {
  const location = useLocation();
  const { cartItems } = location.state || {};
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState(null); // Store user details, including addresses
  const [addAddress, setAddAddress] = useState(false); // Toggle address form
  const [editingAddress, setEditingAddress] = useState(null); // Address being edited
  const navigate = useNavigate();

  const subTotal = useMemo(() => {
    return cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2) || 0;
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  }, [cartItems]);

  const onDeleteAddress = async (addressId) => {
    try {
      dispatch(setLoading(true));
      await deleteAddressAPI(userInfo.id, addressId); // Pass userId and addressId as needed
      const updatedAddresses = userInfo.addresses.filter((address) => address.id !== addressId);
      setUserInfo({ ...userInfo, addresses: updatedAddresses });
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onUpdateAddress = async (data) => {
    try {
      dispatch(setLoading(true));
      await updateAddressAPI(data, userInfo.id); // Update the address with user ID
      const updatedUserInfo = await fetchUserDetails(userInfo.id);
      setUserInfo(updatedUserInfo); // Update local state
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onEditAddress = (address) => {
    setEditingAddress(address); // Set the address to be edited
    setAddAddress(true); // Open the form
  };

  useEffect(() => {
    dispatch(setLoading(true));
    fetchUserDetails()
      .then((res) => setUserInfo(res))
      .catch((err) => console.error(err))
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch]);

  // Prepare order data for submission
  const prepareOrderData = () => {
    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));
  
    return [{
      userId: userInfo.id,
      orderDate: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      shippingAddress: userInfo?.addresses?.[0]?.street || "", // You can change to the selected address
      totalPrice: subTotal,
      orderStatus: "PENDING",
      totalItem: totalItems,
      orderItems: orderItems,  // Include orderItems array
    }];
  };
  
  const onConfirmOrder = async () => {
    try {
      dispatch(setLoading(true));
      const orderData = prepareOrderData();
      
      // Send the array of OrderDTO with all required fields to the backend
      const token = getToken()
      const response = await axios.post(
        `${API_BASE_URL}/auth/orders/create`,
        orderData,  // This should be an array of OrderDTO
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Order confirmed:", response.data);
      navigate("/orderConfirmed"); // Redirect after confirming order
    } catch (error) {
      console.error("Error confirming order:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  return (
    <div className="p-8 flex">
      <div className="w-[70%]">
        <div className="pt-4">
          <div className="flex gap-12">
            <h3 className="text-lg font-bold">Address</h3>
            {!userInfo?.addresses?.length && (
              <button
                className="w-[150px] items-center h-[48px] bg-red-500 border rounded-lg mt-4 text-white hover:bg-green-800"
                onClick={() => setAddAddress(true)}
              >
                Add New Address
              </button>
            )}
          </div>
          <div className="pt-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-8 pb-10 mb-8">
            {userInfo?.addresses?.length ? (
              userInfo.addresses.map((address) => (
                <div key={address.id} className="bg-gray-200 border rounded-lg p-4">
                  <p>
                    {address.street}, {address.city}, {address.state}
                  </p>
                  <p>{address.pincode}</p>
                  <div className="flex gap-4 mt-2">
                    <button
                      className="w-[150px] items-center h-[48px] bg-green-500 border rounded-lg mt-4 text-white hover:bg-green-700"
                      onClick={() => onEditAddress(address)}
                    >
                      Update
                    </button>
                    <button
                      className="w-[150px] items-center h-[48px] bg-black border rounded-lg mt-4 text-white hover:bg-gray-800"
                      onClick={() => onDeleteAddress(address.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No addresses found.</p>
            )}
          </div>
        </div>

        {addAddress && (
          <AddAddress
            onCancel={() => {
              setAddAddress(false);
              setEditingAddress(null);
            }}
            address={editingAddress} // Pass the address to edit
            onSave={(updatedData) => {
              onUpdateAddress(updatedData); // Update the address when saved
              setAddAddress(false);
            }}
          />
        )}

        <button
          className="w-[150px] items-center h-[48px] bg-black border rounded-lg mt-4 text-white hover:bg-gray-800"
          onClick={onConfirmOrder} // Call onConfirmOrder when the button is clicked
        >
          Confirm Orders
        </button>
      </div>

      <div className="w-[30%] h-[30%] border rounded-lg border-gray-500 p-4 flex flex-col gap-4">
        <p>Order Summary</p>
        <p>Items Count = {totalItems}</p>
        <p>SubTotal = ₹{subTotal}</p>
        <p>Shipping = FREE</p>
        <hr className="h-[2px] bg-gray-400" />
        <p>Total Amount = ₹{subTotal}</p>
      </div>
    </div>
  );
};

export default Checkout;
