import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: null,
  isHolder: false,
  canSumbitArt: false,
  balance: 0,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setIsHolder: (state, action) => {
      state.isHolder = action.payload;
    },
    setCanSubmitArt: (state, action) => {
      state.canSumbitArt = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    wallet: walletSlice.reducer,
  },
});

export const { setAddress, setIsHolder, setCanSubmitArt, setBalance } =
  walletSlice.actions;

export default store;
