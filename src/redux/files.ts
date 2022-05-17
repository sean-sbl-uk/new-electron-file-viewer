import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//for File objects
export const filesSlice = createSlice({
  name: "files",
  initialState: {
    data: null,
  },
  reducers: {
    setFiles: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    resetFiles: (state) => {
      state.data = null;
    },
  },
});

export const { setFiles, resetFiles } = filesSlice.actions;

export default filesSlice.reducer;
