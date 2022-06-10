import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

export const renderWithMockStore = (component, initialState = {}) => {
  const mockStore = configureStore();
  const store = mockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

export const renderWithStore = (component) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};
