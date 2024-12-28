import { createSlice } from "@reduxjs/toolkit";
// import { removeCartItem } from '../../api/cartApi'; // Import API function

// Initial cart state with items either from localStorage or empty array
const initialState = {
  cart: JSON.parse(localStorage.getItem('cart')) || [], // Cart can be loaded from localStorage
  totalPrice: 0, // Total price
  totalItems: 0, // Total items count
};

const cartSlice = createSlice({
  name: 'cartState',
  initialState: initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action) => {
      const existingItemIndex = state.cart.findIndex(item =>
        item.id === action.payload.productId && item.variant?.id === action.payload.variantId
      );

      if (existingItemIndex !== -1) {
        state.cart[existingItemIndex].quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }

      localStorage.setItem('cart', JSON.stringify(state.cart));
    },

    // Remove item from cart (local state only)
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item =>
        item.id !== action.payload.productId || item.variant?.id !== action.payload.variantId
      );

      localStorage.setItem('cart', JSON.stringify(state.cart));
    },

    // Update quantity of an item in the cart
    updateQuantity: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item?.variant?.id === action.payload.variant_id) {
          return {
            ...item,
            quantity: action.payload.quantity,
            subTotal: action.payload.quantity * item.price,
          };
        }
        return item;
      });

      localStorage.setItem('cart', JSON.stringify(state.cart));
    },

    // Load cart items from the backend (called from API)
    loadCartItems: (state, action) => {
      const { cartItems = [], totalPrice = 0, totalItems = 0 } = action.payload || {};

      console.log("Loading Cart Items:", cartItems); // Log cart data being loaded
      state.cart = cartItems;
      state.totalPrice = totalPrice;
      state.totalItems = totalItems;
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },

    // Clear entire cart
    deleteCart: (state) => {
      state.cart = [];
      localStorage.removeItem('cart');
    },

    // Clear cart on logout
    clearCartOnLogout: (state) => {
      state.cart = [];
      localStorage.removeItem('cart');
    },
  },
});




// Export actions for usage in components
export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  deleteCart, 
  clearCartOnLogout, 
  loadCartItems // Export loadCartItems action
} = cartSlice.actions;

// Selectors
export const countCartItems = (state) => state.cartState.cart.length;
export const selectCartItems = (state) => state.cartState.cart ?? [];
export const selectTotalPrice = (state) => state.cartState.totalPrice;
export const selectTotalItems = (state) => state.cartState.totalItems;

export default cartSlice.reducer;
