import { createSlice } from '@reduxjs/toolkit';
import { authInitialState } from '../initialStates';
import { RootState } from '../store';

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setShopkeeperInLocalState: (state, action) => {
      state.shopkeeper = action.payload.shopkeeper;
      state.token = action.payload.token;
    },
    RemoveShopkeeperFromLocalState: (state) => {
      state.shopkeeper = null;
      state.token = null;
    },
  },
});

export const { setShopkeeperInLocalState, RemoveShopkeeperFromLocalState } =
  authSlice.actions;
export default authSlice.reducer;

export const useCurrentToken = (state: RootState) => state.auth.token;
export const useCurrentShopkeeper = (state: RootState) => state.auth.shopkeeper;
