import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, getByTestId, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Filters from './Filters';

describe('filter modal', () => {
  const initialState = {};
  const mockStore = configureStore();
  const store = mockStore(initialState);
  const mockFunc = jest.fn();

  it('should render', () => {
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <Filters
          handleCloseFiltering={mockFunc}
          handleFilterSubmit={mockFunc}
          show={true}
        />
      </Provider>
    );

    expect(getByText('Filters')).toBeInTheDocument();
    // expect(getByTestId('filter-modal')).toBeInTheDocument();
  });

  it('should show dropdown for top hits', () => {
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <Filters
          handleCloseFiltering={mockFunc}
          handleFilterSubmit={mockFunc}
          show={true}
        />
      </Provider>
    );

    const dropdown = getByText('Top hits/cells per ml');
    fireEvent.click(dropdown);

    expect(getByText('20')).toBeInTheDocument();
    expect(getByText('50')).toBeInTheDocument();
    expect(getByText('All')).toBeInTheDocument();
  });
});
