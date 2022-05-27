import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Container from './Container';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

describe('Container', () => {
  const initialState = {};
  const mockStore = configureStore();
  const store = mockStore(initialState);

  it('should render', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Container />
      </Provider>
    );
  });
});
