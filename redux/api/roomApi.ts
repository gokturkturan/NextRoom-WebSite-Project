import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    postReview: builder.mutation({
      query(body) {
        return {
          url: "/review",
          method: "PUT",
          body,
        };
      },
    }),
    canUserReview: builder.query({
      query(id) {
        return {
          url: `/review/can_review?roomId=${id}`,
        };
      },
    }),
  }),
});

export const { usePostReviewMutation, useCanUserReviewQuery } = roomApi;
