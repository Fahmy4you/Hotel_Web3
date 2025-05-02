// store/usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GetAllUser } from '../../src/app/Server/GetAllUser';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  deletedAt: string | null;
  updatedAt: string;
}

// Definisikan tipe untuk state
interface UsersState {
  list: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = {
  list: [],
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetchUsers',
  async () => {
    const users = await GetAllUser();
    return users?.map(user => ({
      id: user.id.toString(),
      name: user.nama,
      email: user.email,
      role: user.role_id.toString(),
      createdAt: user.createdAt.toString(),
      deletedAt: user.deletedAt?.toString() || null,
      updatedAt: user.updatedAt.toString(),
    })) || []; // Fallback to an empty array if `users` is null/undefined
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export default usersSlice.reducer;