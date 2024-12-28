import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../store/features/cart';
import { fetchUserDetails } from '../../api/userInfo';
import { setLoading } from '../../store/features/common';
import { useNavigate } from 'react-router-dom';
import PaymentPage from '../PaymentPage/PaymentPage';

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState([]);
  const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', state: '', zipCode: '' });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');

  const subTotal = useMemo(() => {
    let value = 0;
    cartItems?.forEach((element) => {
      value += element?.subTotal;
    });
    return value?.toFixed(2);
  }, [cartItems]);

  useEffect(() => {
    dispatch(setLoading(true));
    fetchUserDetails()
      .then((res) => {
        setUserInfo(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  const handleAddAddress = () => {
    // Assuming `addAddress` is an API to add a new address
    const updatedAddressList = [...(userInfo?.addressList || []), newAddress];
    setUserInfo((prev) => ({
      ...prev,
      addressList: updatedAddressList,
    }));
    setIsAddingAddress(false);
    setNewAddress({ name: '', street: '', city: '', state: '', zipCode: '' });
  };

  return (
    <div className="p-8 flex">
      <div className="w-[70%]">
        <div className="flex gap-8">
          {/* Address */}
          <p className="font-bold">Delivery address</p>
          {userInfo?.addressList?.length > 0 && (
            <div>
              <p>{userInfo?.addressList?.[0]?.name}</p>
              <p>{userInfo?.addressList?.[0]?.street}</p>
              <p>
                {userInfo?.addressList?.[0]?.city},{userInfo?.addressList?.[0]?.state}{' '}
                {userInfo?.addressList?.[0]?.zipCode}
              </p>
            </div>
          )}
          {!isAddingAddress && (
            <button
              className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setIsAddingAddress(true)}
            >
              Add Address
            </button>
          )}
        </div>

        {isAddingAddress && (
          <div className="mt-4 border p-4 rounded">
            <h4 className="font-bold mb-2">Add New Address</h4>
            <input
              className="border p-2 w-full mb-2"
              placeholder="Name"
              value={newAddress.name}
              onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="Street"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="Zip Code"
              value={newAddress.zipCode}
              onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleAddAddress}
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setIsAddingAddress(false)}
            >
              Cancel
            </button>
          </div>
        )}

        <hr className="h-[2px] bg-slate-200 w-[90%] my-4"></hr>
        {/* Other checkout sections */}
        {/* <div className="flex flex-col gap-2">
          <p className="font-bold">Payment Method</p>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                type="radio"
                name="payment_method"
                value={'CARD'}
                onChange={() => setPaymentMethod('CARD')}
              />
              <p> Credit/Debit Card</p>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="payment_method"
                value={'COD'}
                onChange={() => setPaymentMethod('COD')}
              />
              <p> Cash on delivery</p>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="payment_method"
                value={'UPI'}
                onChange={() => setPaymentMethod('UPI')}
              />
              <p> UPI/Wallet</p>
            </div>
          </div>
        </div> */}

        {paymentMethod === 'CARD' && <PaymentPage userId={userInfo?.id} addressId={userInfo?.addressList?.[0]?.id} />}
        {paymentMethod !== 'CARD' && (
          <button
            className="w-[150px] items-center h-[48px] bg-black border rounded-lg mt-4 text-white hover:bg-gray-800"
            onClick={() => navigate('/payment')}
          >
            Confirm Orders
          </button>
        )}
      </div>

      <div className="w-[30%] h-[30%] border rounded-lg border-gray-500 p-4 flex flex-col gap-4">
        <p>Order Summary</p>
        <p>Items Count = {cartItems?.length}</p>
        <p>SubTotal = ${subTotal}</p>
        <p>Shipping = FREE</p>
        <hr className="h-[2px] bg-gray-400"></hr>
        <p>Total Amount = ${subTotal}</p>
      </div>
    </div>
  );
};

export default Checkout;
