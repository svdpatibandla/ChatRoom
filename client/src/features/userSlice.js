// import createSlice function from redux toolkit and appApi
import { createSlice } from "@reduxjs/toolkit";
import appApi from "../services/appApi";

// create userSlice
export const userSlice = createSlice({
    name: "user",
    initialState: null,
    // create reducers to handle user's new notifications and to reset notifications
    reducers: {
        addNotifications: (state, { payload }) => {
            if (state.newMessages[payload]) {
                state.newMessages[payload] = state.newMessages[payload] + 1;
            } else {
                state.newMessages[payload] = 1;
            }
        },
        resetNotifications: (state, { payload }) => {
            delete state.newMessages[payload];
        },
    },
    // add extraReducers to save user after signup, login, and to logout
    extraReducers: (builder) => {
        builder.addMatcher(appApi.endpoints.signupUser.matchFulfilled, (state, { payload }) => payload);
        builder.addMatcher(appApi.endpoints.loginUser.matchFulfilled, (state, { payload }) => payload);
        builder.addMatcher(appApi.endpoints.logoutUser.matchFulfilled, () => null);
    },
});

// export addNotifications and resetNotifications actions along with userSlice reducer
export const { addNotifications, resetNotifications } = userSlice.actions;
export default userSlice.reducer;
