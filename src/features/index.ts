import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import hotelReducer from "./hotel/hotelSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  hotel: hotelReducer,
});

export default rootReducer;
