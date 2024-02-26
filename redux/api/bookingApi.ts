import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    newBooking: builder.mutation({
      query(body) {
        return {
          url: "/booking",
          method: "POST",
          body,
        };
      },
    }),
    checkRoomAvailability: builder.query({
      query({ id, checkInDate, checkOutDate }) {
        return {
          url: `/booking/check_room_availability?roomId=${id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`,
        };
      },
    }),
    getRoomBookedDates: builder.query({
      query({ id }) {
        return {
          url: `/booking/booked_dates?roomId=${id}`,
        };
      },
    }),
  }),
});

export const {
  useNewBookingMutation,
  useLazyCheckRoomAvailabilityQuery,
  useGetRoomBookedDatesQuery,
} = bookingApi;
