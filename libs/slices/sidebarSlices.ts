import { createSlice } from '@reduxjs/toolkit';

interface SidebarState {
  isCollapsed: boolean;
  settingSidebarCollapsed: boolean;
  mobileCollapsed: boolean;
}

const initialState: SidebarState = {
  isCollapsed: false,
  settingSidebarCollapsed: false,
  mobileCollapsed: true
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    setSidebar: (state, action) => {
      state.isCollapsed = action.payload;
    },
    toggleSettingSidebar: (state) => {
      state.settingSidebarCollapsed = !state.settingSidebarCollapsed;
    },
    setSettingSidebar: (state, action) => {
      state.settingSidebarCollapsed = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.mobileCollapsed = !state.mobileCollapsed;
    },
    setMobileSidebar: (state, action) => {
      state.mobileCollapsed = action.payload;
    }
  },
});

export const { 
  toggleSidebar, 
  setSidebar, 
  toggleSettingSidebar, 
  setSettingSidebar,
  toggleMobileSidebar,
  setMobileSidebar
} = sidebarSlice.actions;

export default sidebarSlice.reducer;