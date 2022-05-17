import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//Slice
export const spikeDataSlice = createSlice({
  name: "spikeData",
  initialState: {
    data: {},
  },
  reducers: {
    setSpikeData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    resetSpikeData: (state) => {
      state.data = {};
    },
  },
});

//Actions
export const { setSpikeData, resetSpikeData } = spikeDataSlice.actions;

export default spikeDataSlice.reducer;

