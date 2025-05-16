import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  hideThemeToggle: boolean;
}

const initialState: SettingsState = {
  hideThemeToggle: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setHideThemeToggle: (state, action: PayloadAction<boolean>) => {
      state.hideThemeToggle = action.payload;
    },
  },
});

export const { setHideThemeToggle } = settingsSlice.actions;
export default settingsSlice.reducer;