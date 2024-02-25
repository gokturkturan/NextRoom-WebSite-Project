import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query(body) {
        return {
          url: "/auth/register",
          method: "POST",
          body,
        };
      },
    }),
    forgotPassword: builder.mutation({
      query(body) {
        return {
          url: "/password/forgot",
          method: "POST",
          body,
        };
      },
    }),
    resetPassword: builder.mutation({
      query({ resetToken, body }) {
        return {
          url: `/password/reset/${resetToken}`,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
