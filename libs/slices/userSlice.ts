import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from 'viem';

type UserState = {
  id: number | null;
  nama : string | null;
  wallet_address: Address | null;
  role_id: number | null;
};

const initialState: UserState = {
  id: null,
  nama: null,
  wallet_address: null,
  role_id: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return { ...action.payload };
    },
    logoutUser() {
      return initialState;
    }
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
