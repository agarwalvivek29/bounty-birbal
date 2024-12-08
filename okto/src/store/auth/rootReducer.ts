import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authslice";

const rootReducer = combineReducers({
  auth: authSlice,
});

export default rootReducer;
