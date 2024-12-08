import { OrderData, Wallet } from "@/src/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  idToken: string | null;
  authToken: string | null;
  walletAddress: Wallet[] | null;
  history: OrderData[];
}

const initialState: AuthState = {
  idToken: null,
  authToken: null,
  walletAddress: [],
  history: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIdToken: (state, action: PayloadAction<string>) => {
      state.idToken = action.payload;
    },
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    setWalletAddress(state, action: PayloadAction<Wallet[]>) {
      state.walletAddress = action.payload;
    },
    setHistory: (state, action: PayloadAction<OrderData[]>) => {
      state.history = action.payload;
    },
    addHistory: (state, action: PayloadAction<OrderData>) => {
      state.history.push(action.payload);
    },
    logout: (state) => {
      state.idToken = null;
      state.authToken = null;
      state.walletAddress = null;
      state.history = [];
    },
  },
});

export const {
  setIdToken,
  setAuthToken,
  setWalletAddress,
  logout,
  setHistory,
  addHistory,
} = authSlice.actions;
export default authSlice.reducer;
