import React from 'react';
import Loader from './Loader';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

describe('Loader', () => {
  const initialState = {};
  const mockStore = configureStore();
  let store, wrapper;

  it('shold render', () => {
    store = mockStore(initialState);
    const { getByTestId } = render(
      <Provider store={store}>
        <Loader />
      </Provider>
    );

    expect(getByTestId('loader')).toBeInTheDocument();
  });
});
