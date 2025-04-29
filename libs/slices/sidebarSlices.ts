import { createSlice } from '@reduxjs/toolkit';
import { setServers } from 'dns';

interface SidebarState {
  isColapsed : boolean;
}

const initialState: SidebarState = {
  isColapsed: false,
};


const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isColapsed = !state.isColapsed;
    },
    setSidebar: (state, action) => {
      state.isColapsed = action.payload;
    }
  },
});

export const { toggleSidebar, setSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;