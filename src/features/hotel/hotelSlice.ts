import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HotelState } from "./types";
import { Hotel } from "@/types/hotel";

const initialState: HotelState = {
  currentHotel: null,
  isLoading: false,
  error: null,
};

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    setCurrentHotel: (state, action: PayloadAction<Hotel>) => {
      state.currentHotel = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearHotel: (state) => {
      state.currentHotel = null;
      state.error = null;
    },
  },
});

export const { setCurrentHotel, setLoading, setError, clearHotel } =
  hotelSlice.actions;

export default hotelSlice.reducer;
