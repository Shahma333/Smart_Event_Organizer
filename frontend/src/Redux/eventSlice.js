import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter(event => event._id !== action.payload);
    }
  },
});

export const { setEvents, addEvent, deleteEvent } = eventSlice.actions;
export const eventReducer = eventSlice.reducer;
