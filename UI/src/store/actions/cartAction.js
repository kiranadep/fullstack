import { addToCart, updateQuantity, removeFromCart, deleteCart, clearCartOnLogout } from "../features/cart"; // Correct path
import { logoutUser } from '../features/authSlice';
import { removeCartItem } from '../../api/cartApi';
import { loadCartItems } from '../features/cart'; 
// Action to add item to the cart
export const addItemToCartAction = (productItem) => {
  return (dispatch) => {
    dispatch(addToCart(productItem)); // Dispatching the addToCart action
  };
};

// Action to update quantity in the cart
export const updateItemToCartAction = (productItem) => {
  return (dispatch) => {
    dispatch(updateQuantity({
      variant_id: productItem.variant_id,
      quantity: productItem.quantity, // Passing the updated quantity
    }));
  };
};

export const deleteItemFromCartAction = ({ userId, cartItemId }) => async (dispatch) => {
  try {
    console.log('Deleting cart item:', cartItemId);
    const updatedCart = await removeCartItem(userId, cartItemId);
    console.log('Dispatching updated cart:', updatedCart);
    dispatch(loadCartItems(updatedCart));
  } catch (error) {
    console.error('Failed to delete item from cart:', error.message);
  }
};



// Action to clear the cart
export const clearCart = () => {
  return (dispatch) => {
    dispatch(deleteCart()); // Dispatching deleteCart to clear all items
  };
};

// Action to handle user logout and clear cart
export const handleLogout = () => {
  return (dispatch) => {
    // Dispatch logout action
    dispatch(logoutUser());

    // Dispatch clear cart action on logout
    dispatch(clearCartOnLogout());

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('cart');

    // Redirect to the homepage
    window.location.href = '/';
  };
};

