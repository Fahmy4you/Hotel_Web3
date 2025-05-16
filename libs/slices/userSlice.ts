import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from 'viem';

type UserState = {
  id: number | null;
  nama : string | null;
  email : string | null;
  wallet_address: Address | null;
  profile_pict: string | null;
  role_id: number | null;
  nama_role : string | null;
  whatsapp : string | null;
  joined_date : string | null;
};

const initialState: UserState = {
  id: null,
  nama: null,
  email : null,
  wallet_address: null,
  profile_pict: null,
  role_id: null,
  nama_role : null,
  whatsapp : null,
  joined_date: null
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
