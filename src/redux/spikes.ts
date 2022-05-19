import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SpikeDataSliceState = {
  data: Spikes[];
}

const initialState: SpikeDataSliceState = {
  data: []
}
//Slice
export const spikeDataSlice = createSlice({
  name: "spikeData",
  initialState,
  reducers: {
    setSpikeData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    resetSpikeData: (state) => {
      state.data = [];
    },
  },
});

//Actions
export const { setSpikeData, resetSpikeData } = spikeDataSlice.actions;

export default spikeDataSlice.reducer;

