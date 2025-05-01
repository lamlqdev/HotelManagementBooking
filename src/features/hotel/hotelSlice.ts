import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Hotel } from "@/types/hotel";

interface HotelState {
  currentHotel: Hotel | null;
}

const initialState: HotelState = {
  currentHotel: localStorage.getItem("currentHotel")
    ? JSON.parse(localStorage.getItem("currentHotel")!)
    : null,
};

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    setCurrentHotel: (state, action: PayloadAction<Hotel>) => {
      state.currentHotel = action.payload;
      localStorage.setItem("currentHotel", JSON.stringify(action.payload));
    },
    clearCurrentHotel: (state) => {
      state.currentHotel = null;
      localStorage.removeItem("currentHotel");
    },
  },
});

export const { setCurrentHotel, clearCurrentHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
