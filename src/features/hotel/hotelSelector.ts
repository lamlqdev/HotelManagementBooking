import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

export const selectHotel = createSelector(
  (state: RootState) => state.hotel,
  (hotel) => hotel
);

export const selectCurrentHotel = createSelector(
  selectHotel,
  (hotel) => hotel.currentHotel
);
