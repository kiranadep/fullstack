import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectTotalPrice } from '../../store/features/cart';
import { NumberInput } from '../../components/NumberInput/NumberInput';
import { deleteItemFromCartAction, updateItemToCartAction } from '../../store/actions/cartAction'; // Load cart items action
import DeleteIcon from '../../components/common/DeleteIcon';
import Modal from 'react-modal';
import { customStyles } from '../../styles/modal';
import { isTokenValid } from '../../utils/jwt-helper';
import { Link, useNavigate } from 'react-router-dom';
import EmptyCart from '../../assets/img/empty_cart.png';
import { getCartByUserId } from '../../api/cartApi';
import { loadCartItems } from '../../store/features/cart';
import { selectUserInfo } from "../../store/features/user";

const headers = [
  "Product Details", "Price", "Quantity", "Shipping", "SubTotal", "Action"
];

const Cart = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo); // Use selector at the top level
  
  const onChangeQuantity = useCallback((value, productId, variantId) => {
    dispatch(updateItemToCartAction({
      variant_id: variantId,
      quantity: value,
    }));
  }, [dispatch]);

  const onDeleteProduct = useCallback((productId, variantId) => {
    setModalIsOpen(true);
    setDeleteItem({
      productId: productId,
      variantId: variantId,
    });
  }, []);


  const onCloseModal = useCallback(() => {
    setDeleteItem({});
    setModalIsOpen(false);
  }, []);

  const onDeleteItem = useCallback(() => {
    dispatch(
      deleteItemFromCartAction({
        userId: userInfo.id, // Pass userId
        cartItemId: deleteItem.variantId, // Pass cartItemId
      })
    );
    setModalIsOpen(false);
  }, [deleteItem, dispatch, userInfo.id]);
  


  const subTotal = useMemo(() => {
    let value = 0;
    cartItems?.forEach(element => {
      console.log("The price of the product:", element.price);
      console.log("The quantity of the product:", element.quantity);
      value += element.price * element.quantity; // Multiply price by quantity for correct subtotal
    });
    return value?.toFixed(2); // Format subtotal to 2 decimal places
  }, [cartItems]);
  
  

  const grandTotal = useMemo(() => {
    const shipping = 0; // Define shipping cost
    return (parseFloat(subTotal) + shipping).toFixed(2); // Add subtotal and shipping
  }, [subTotal]);
  

  const isLoggedIn = useMemo(() => {
    return isTokenValid();
  }, []);
  console.log('User Info:', userInfo);

  const handleCheckout = () => {
    navigate('/checkout', { state: { cartItems, subTotal } });
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    
    const fetchCart = async () => {
      try {
        const response = await getCartByUserId(userInfo.id); // Fetch cart by user ID
        dispatch(loadCartItems(response)); 
        console.log('the response :',response);// Dispatch cart items into Redux
      } catch (error) {
        console.error('Failed to load cart data', error);
      }
    };
    
    if (userInfo.id) {
      fetchCart();
    }
  }, [isLoggedIn, dispatch, userInfo.id]); // Add 'userInfo.id' as a dependency
  
  

  useEffect(() => {
    console.log("detailed :", cartItems);
  }, [cartItems]);

  return (
    <div className='p-4'>
      {isLoggedIn ? (
        cartItems?.length > 0 ? (
          <>
            {/* Shopping Cart Table */}
            <p className='text-xl text-black p-4'>Shopping Bag</p>
            <table className='w-full text-lg'>
              <thead className='text-sm bg-black text-white uppercase'>
                <tr>
                  {headers?.map(header => (
                    <th scope='col' className='px-6 py-3' key={header}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                  {cartItems?.map((item, index) => (
                    <tr className='p-4 bg-white border-b' key={index}>
                      {/* Product Details */}
                      <td>
                        <div className='flex p-4'>
                       <img
                            src={`http://localhost:8080/upload_imges/${item.imagePath?item.imagePath.split('/').pop():'default-image.jpg'}`}
                            alt={'product-' + index}
                            className='w-[120px] h-[120px] object-cover'
                          />   
                          <div className='flex flex-col text-sm px-2 text-gray-600'>
                            <p>Product : {item.productName}</p> {/* Display product name */}
                            <p>Size : {item.size}</p> {/* Display size */}
                          </div>
                        </div>
                      </td>
                      {/* Price */}
                      <td>
                        <p className='text-center text-sm text-gray-600'>₹{item.price}</p> {/* Display product price */}
                      </td>
                      {/* Quantity */}
                      <td>
                        <NumberInput
                          max={10}
                          quantity={item.quantity}
                          onChangeQuantity={(value) => onChangeQuantity(value, item.productId, item.variant?.id)}
                        />
                      </td>
                      {/* Shipping */}
                      <td>
                        <p className='text-center text-sm text-gray-600'>FREE</p> {/* Shipping */}
                      </td>
                      {/* SubTotal */}
                      <td>
                        <p className='text-center text-sm text-gray-600'>₹{(item.price * item.quantity).toFixed(2)}</p> {/* Subtotal (Price * Quantity) */}
                      </td>
                      {/* Delete Action */}
                      <td>
                        <button
                          className='flex justify-center items-center w-full'
                          onClick={() => onDeleteProduct(item.productId, item.id)}
                        >
                          <DeleteIcon />
                        </button>
                      </td>

                      
                    </tr>
                  ))}
                </tbody>

            </table>

            {/* Cart Summary */}
            <div className='flex justify-between bg-gray-200 p-8'>
              <div>
                <p className='text-lg font-bold'>Discount Coupon</p>
                <p className='text-sm text-gray-600'>Enter your coupon code</p>
                <form>
                  <input
                    type='text'
                    className='w-[150px] h-[48px] mt-2 border-gray-500 p-2 hover:outline-none'
                    placeholder='Enter code'
                  />
                  <button className='w-[80px] h-[48px] bg-black text-white'>
                    Apply
                  </button>
                </form>
              </div>
              <div className='mr-20 pr-8'>
              <div className='flex gap-8 text-lg'>
                <p className='w-[120px]'>SubTotal</p> <p>₹{subTotal}</p>
              </div>
              <div className='flex gap-8 text-lg mt-2'>
                <p className='w-[120px]'>Shipping</p> <p>₹{0}</p>
              </div>
              <div className='flex gap-8 text-lg mt-2 font-bold'>
                <p className='w-[120px]'>Grand Total</p> <p>₹{grandTotal}</p>
              </div>

                <hr className='h-[2px] bg-slate-400 mt-2' />
                <button
                  className='w-full items-center h-[48px] bg-black border rounded-lg mt-2 text-white hover:bg-gray-800'
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        ) : (
          // Empty Cart Message
          <div className='w-full items-center text-center'>
            <div className='flex justify-center'>
              <img src={EmptyCart} className='w-[240px] h-[240px]' alt='empty-cart' />
            </div>
            <p className='text-3xl font-bold'>Your cart is empty</p>
            <div className='p-4'>
              <Link
                to={'/'}
                className='w-full p-2 items-center h-[48px] bg-black border rounded-lg mt-2 text-white hover:bg-gray-800'
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )
      ) : (
        // User Not Logged In Message
        <div className='w-full items-center text-center'>
          <p className='text-xl font-bold'>Please log in to view your cart</p>
          <div className='p-4'>
            <Link
              to={'/v1/login'}
              className='w-full p-2 items-center h-[48px] bg-black border rounded-lg mt-2 text-white hover:bg-gray-800'
            >
              Login
            </Link>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={onCloseModal}
        style={customStyles}
        contentLabel="Remove Item"
      >
        <p>Are you sure you want to remove this item?</p>
        <div className='flex justify-between p-4'>
          <button className='h-[48px]' onClick={onCloseModal}>
            Cancel
          </button>
          <button
            className='bg-black text-white w-[80px] h-[48px] border rounded-lg'
            onClick={onDeleteItem}
          >
            Remove
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
