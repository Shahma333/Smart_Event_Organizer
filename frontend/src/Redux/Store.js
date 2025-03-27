import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";  
import { eventReducer } from "./eventSlice"; 

const store = configureStore({
  reducer: {
    auth: authReducer, 
    events: eventReducer, 
  },
});

export default store;
