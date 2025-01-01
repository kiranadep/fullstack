import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  userInfo: {}, // Default state for user information
  orders: [], // Default state for orders
  addresses: [],
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    loadUserInfo: (state, action) => {
      state.userInfo = action.payload; // Direct state mutation is allowed with Immer
    },
    saveAddress: (state, action) => {
      const addresses = state.userInfo.addresses || []; // Fallback to an empty array if addresses is undefined
      addresses.push(action.payload); // Add the new address
      state.userInfo.addresses = addresses;
    },
    removeAddress: (state, action) => {
      state.userInfo.addresses = state.userInfo.addresses.filter(
        (address) => address.id !== action.payload
      );
    },
    loadOrders: (state, action) => {
      state.orders = action.payload; // Directly set the orders array
    },
    cancelOrder: (state, action) => {
      console.log("Cancel Order Payload:", action.payload);
      state.orders = state.orders.map((order) =>
        order.orderid === action.payload
          ? { ...order, orderStatus: "CANCELLED" }
          : order
      );
    },
    
    
  },
});

export const {
  loadUserInfo,
  saveAddress,
  removeAddress,
  loadOrders,
  cancelOrder,
} = userSlice.actions;

// Selectors
export const selectUserInfo = (state) => state.userState?.userInfo || {};
export const selectAllOrders = (state) => state.userState?.orders || [];
export const selectIsUserAdmin = (state) =>
  state.userState?.userInfo?.authorityList?.some(
    (authority) =>
      authority?.roleCode === "ADMIN" && authority?.authority === "ADMIN"
  );

export default userSlice.reducer;
