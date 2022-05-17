import { configureStore } from "@reduxjs/toolkit";
import spikesReducer from "./spikes";
import filesReducer from "./files";
import recordsReducer from "./records";

const store = configureStore({
  reducer: {
    spikeData: spikesReducer,
    files: filesReducer,
    records: recordsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
