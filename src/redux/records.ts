import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RecordsSliceState = {
  data: FileRecords[];
}

const initialState: RecordsSliceState = {
  data: [],
};

export const recordsSlice = createSlice({
  name: "fileRecords",
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<FileRecords>) => {

      const { fileName } = action.payload;

      if(!state.data.some(records => records.fileName === fileName) ){
        state.data.push(action.payload)
      }
    },
  },
});

export const { setRecords } = recordsSlice.actions;

export default recordsSlice.reducer;
