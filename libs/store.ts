import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "./storage";
import sidebarReducer from "../libs/slices/sidebarSlices";
import modalsReducer from "../libs/slices/modalSlice";
import themeReducer from "../libs/slices/themeSlices";
import usersReducer from "../libs/slices/userSlice";
import activeMenuReducer from "../libs/slices/activeMenuSlice";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  theme: themeReducer,
  activeMenu: activeMenuReducer,
  users : usersReducer,
  modals : modalsReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["sidebar", "theme", "activeMenu", "users"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
