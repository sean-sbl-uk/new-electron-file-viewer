import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import Dropzone from './Dropzone';
import { Button } from 'bootstrap';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

describe('Dropzone', () => {
  const initialState = {};
  const mockStore = configureStore();
  let store, wrapper;
  const setFiles = jest.fn();
  // const mockFile = jest.mock('../ file.csv');

  it('should render', () => {
    store = mockStore(initialState);
    const { getByTestId } = render(
      <Provider store={store}>
        <Dropzone setFiles={setFiles} />
      </Provider>
    );

    expect(getByTestId('dropzone')).toBeInTheDocument();
  });

  it('shold call the setFiles method on input change explorer', () => {
    store = mockStore(initialState);

    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <Dropzone setFiles={setFiles} />
      </Provider>
    );

    const dropzoneInput = getByTestId('dropzone-input');
    fireEvent.change(dropzoneInput, { target: { value: '' } });

    expect(setFiles).toBeCalled();
  });
});
