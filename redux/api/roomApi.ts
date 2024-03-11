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
    newRoom: builder.mutation({
      query(body) {
        return {
          url: "/admin/room",
          method: "POST",
          body,
        };
      },
    }),
    updateRoom: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/room/${id}`,
          method: "PUT",
          body,
        };
      },
    }),
    uploadRoomImages: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/room/${id}/upload_images`,
          method: "PUT",
          body,
        };
      },
    }),
    deleteRoomImage: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/room/${id}/delete_image`,
          method: "PUT",
          body,
        };
      },
    }),
    deleteRoom: builder.mutation({
      query({ id }) {
        return {
          url: `/admin/room/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  usePostReviewMutation,
  useCanUserReviewQuery,
  useNewRoomMutation,
  useUpdateRoomMutation,
  useUploadRoomImagesMutation,
  useDeleteRoomImageMutation,
  useDeleteRoomMutation,
} = roomApi;
