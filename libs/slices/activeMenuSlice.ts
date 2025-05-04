import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ActiveMenuState {
  activeMenu : string;
  activeLink : string
}

const initialState: ActiveMenuState = {
  activeMenu: 'dashboard',
  activeLink: '/dashboard'
};

const activeMenuSlice = createSlice({
    name: 'activeMenu',
    initialState,
    reducers: {
      setActiveMenu: (state, action : PayloadAction<{activeMenu : string, activeLink : string}>) => {
        state.activeMenu = action.payload.activeMenu;
        state.activeLink = action.payload.activeLink;
      }
    },
  });
export const {setActiveMenu}  = activeMenuSlice.actions;
export default activeMenuSlice.reducer;