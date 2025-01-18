import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import courseSlice from "./slices/courseSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,
});

export default store;
