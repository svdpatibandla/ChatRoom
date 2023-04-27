import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service for our app and base URL
const appApi = createApi({
    reducerPath: "appApi", // Add a name for the reducer
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5001", // Specify the base URL for the API
    }),

    // Endpoints for different API calls
    endpoints: (builder) => ({
        // Creating a new user
        signupUser: builder.mutation({
            query: (user) => ({
                url: "/users", // URL for the endpoint
                method: "POST", // HTTP method for the request
                body: user, // Request body
            }),
        }),

        // Login user
        loginUser: builder.mutation({
            query: (user) => ({
                url: "/users/login", // URL for the endpoint
                method: "POST", 
                body: user, 
            }),
        }),

        // Logout user
        logoutUser: builder.mutation({
            query: (payload) => ({
                url: "/logout", // URL for the endpoint
                method: "DELETE", 
                body: payload, 
            }),
        }),
    }),
});

// Exporting the mutations for the API endpoints
export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation } = appApi;

export default appApi;
