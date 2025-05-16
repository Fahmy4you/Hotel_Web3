// libs/slices/themeSlices.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeState {
  darkMode: boolean;
  systemMode: boolean;
}

const initialState: ThemeState = {
  darkMode: true,
  systemMode: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setDarkMode: (state) => {
      state.darkMode = true;
      state.systemMode = false;
    },
    setLightMode: (state) => {
      state.darkMode = false;
      state.systemMode = false;
    },
    setSystemMode: (state) => {
      state.systemMode = true;
      state.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    updateSystemTheme: (state, action: PayloadAction<boolean>) => {
      if (state.systemMode) {
        state.darkMode = action.payload;
      }
    },
  },
});

export const { setDarkMode, setLightMode, setSystemMode, updateSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;