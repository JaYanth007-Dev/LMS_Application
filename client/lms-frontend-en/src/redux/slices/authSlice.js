import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";

import axiosInstance from "../../config/axiosinstance";

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || "",
    data: JSON.parse(localStorage.getItem('data') )|| {},
}

export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
      const response = axiosInstance.post("user/register", data);
    toast.promise(response, {
      loading: "Wait! creating your account",
        success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to create your account",
    });
    return await response;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const login = createAsyncThunk("/auth/signin", async (data) => {
  try {
    const response = axiosInstance.post("user/login", data);
    toast.promise(response, {
      loading: "Wait! authenticating your account",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to authenticate your account",
    });
    return await response;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const response = axiosInstance.get("user/logout");
    toast.promise(response, {
      loading: "Wait! logging out your account",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to logout your account",
    });
    return await response;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const updateProfile = createAsyncThunk(
  "/auth/updateProfile",
  async (data) => {
    try {
      const response = axiosInstance.put(`user/update`, data[1]);
      toast.promise(response, {
        loading: "Wait! updating your account",
        success: (data) => {
          console.log(updateProfile, data);
          return data?.data?.message;
        },
        error: "Failed to update your account",
      });
      return (await response).data?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const getUserData = createAsyncThunk("/auth/getData", async () => {
  try {
    const response = axiosInstance.get("/user/me");
    return (await response).data;
  } catch (error) {
    toast.error(error?.message);
  }
});


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(login.fulfilled, (state, action) => {
            console.log("action", action.payload);
            if (action.payload != undefined) {
              localStorage.setItem(
                "data",
                JSON.stringify(action?.payload?.data.data)
              );
              localStorage.setItem("isLoggedIn", true);
              localStorage.setItem("role", action?.payload?.data?.data?.role);
              state.isLoggedIn = true;
              state.role = action?.payload?.data?.data.role;
              state.data = action?.payload?.data?.data
            }
          })
          .addCase(logout.fulfilled, (state) => {
            localStorage.clear();
            state.isLoggedIn = false;
            state.role = "";
            state.data = {};
          })
          .addCase(getUserData.fulfilled, (state, action) => {
            console.log("getUserData.fulfilled",action.payload)
            if (!action?.payload?.data) return;
            localStorage.setItem("data", JSON.stringify(action?.payload?.data));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.data?.role);
            state.isLoggedIn = true;
            state.role = action?.payload?.data?.role;
            state.data = action?.payload?.data;
          });
    }
})

export default authSlice.reducer;