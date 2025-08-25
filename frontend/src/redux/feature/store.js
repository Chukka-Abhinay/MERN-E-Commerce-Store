import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../Api/apiSlice";
import authReducer from "../feature/auth/authSlice";
import favoritesReducer from "../feature/favorites/favoriteSilce";
import cartSliceReducer from "../../redux/feature/cart/cartSlice";
import shopReducer from "../../redux/feature/shop/shopSlice";
import { getFavoritesFromLocalStorage } from "../../Utils/localStorage";

const initialFavorites = getFavoritesFromLocalStorage() || [];

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favorites: favoritesReducer,
    cart: cartSliceReducer,
    shop: shopReducer,
  },

  preloadedState: {
    favorites: initialFavorites,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;