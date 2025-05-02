import {createSlice} from '@reduxjs/toolkit';

interface ActiveMenuState {
  activeMenu: string;
}

const initialState: ActiveMenuState = {
  activeMenu: 'dashboard',
};

const activeMenuSlice = createSlice({
    name: 'activeMenu',
    initialState,
    reducers: {
      setActiveMenu: (state, action) => {
        state.activeMenu = action.payload;
      }
    },
  });
export const {setActiveMenu}  = activeMenuSlice.actions;
export default activeMenuSlice.reducer;