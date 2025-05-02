import {createSlice, PayloadAction} from '@reduxjs/toolkit';


interface ThemeState {
  darkMode: boolean;
}

const initialState: ThemeState = {
    darkMode: true,
}

const themeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    }
  },
});


export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;