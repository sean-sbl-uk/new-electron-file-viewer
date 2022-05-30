import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type FilesSliceState = {
  data: any;
};

const initialState: FilesSliceState = {
  data: {},
};

//for File objects
export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setReduxStoreFiles: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    resetReduxStoreFiles: (state) => {
      state.data = {};
    },
  },
});

export const { setReduxStoreFiles, resetReduxStoreFiles } = filesSlice.actions;

export default filesSlice.reducer;
