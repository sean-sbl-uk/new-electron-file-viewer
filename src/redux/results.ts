import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ResultsDataSliceState = {
  data: ProcessedFileData[];
};

const initialState: ResultsDataSliceState = {
  data: [],
};

export const resultsDataSlice = createSlice({
  name: 'resultsData',
  initialState,
  reducers: {
    setResultsData: (state, action: PayloadAction<ProcessedFileData[]>) => {
      state.data = action.payload;
    },
    resetResultsData: (state) => {
      state.data = [];
    },
  },
});

export const { setResultsData, resetResultsData } = resultsDataSlice.actions;

export default resultsDataSlice.reducer;
