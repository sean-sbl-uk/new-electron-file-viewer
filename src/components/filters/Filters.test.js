import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, getByTestId, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { renderWithMockStore } from '../../utils/testUtils';
import configureStore from 'redux-mock-store';
import Filters from './Filters';

describe('filter modal', () => {
  const initialState = {};
  const mockStore = configureStore();
  const store = mockStore(initialState);
  const mockFunc = jest.fn();
  const handleCloseFiltering = jest.fn();
  const handleFilterSubmit = jest.fn();

  const filterData = {
    spikesOn: true,
    bacteriaOn: true,
    virusOn: true,
    plasmidOn: true,
    hostOn: true,
    archaeaOn: true,
    fungiOn: true,
    protozoaOn: true,
    topHits: '10',
    minHitThreshold: 1,
    scaleOpt: 'logarithmic',
  };

  it('should render', () => {
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <Filters
          group="Test"
          handleCloseFiltering={mockFunc}
          handleFilterSubmit={mockFunc}
          show={true}
          filterData={filterData}
        />
      </Provider>
    );

    expect(getByText('Test Filters')).toBeInTheDocument();
  });

  it('should show dropdown for top hits', () => {
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <Filters
          handleCloseFiltering={mockFunc}
          handleFilterSubmit={mockFunc}
          show={true}
          filterData={filterData}
        />
      </Provider>
    );

    const dropdown = getByText('Top Hits/cells per ml...');
    fireEvent.click(dropdown);

    expect(getByText('20')).toBeInTheDocument();
    expect(getByText('50')).toBeInTheDocument();
    expect(getByText('All')).toBeInTheDocument();
  });

  it('should show scale options', () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <Filters
          handleCloseFiltering={mockFunc}
          handleFilterSubmit={mockFunc}
          show={true}
          filterData={filterData}
        />
      </Provider>
    );

    const dropdown = getByTestId('scale-options');
    fireEvent.click(dropdown);

    expect(getByText('Logarithmic scale (base-10)'));
    expect(getByText('Linear scale'));
  });

  it('should call filter submit method on submit', () => {
    const { getByText } = renderWithMockStore(
      <Filters
        handleCloseFiltering={handleCloseFiltering}
        handleFilterSubmit={handleFilterSubmit}
        show={true}
        filterData={filterData}
      />
    );

    const submitButton = getByText('Apply');
    fireEvent.click(submitButton);

    expect(handleFilterSubmit).toBeCalled();
  });

  it('should call close method on close button click', () => {
    const { getByText } = renderWithMockStore(
      <Filters
        handleCloseFiltering={handleCloseFiltering}
        handleFilterSubmit={handleFilterSubmit}
        show={true}
        filterData={filterData}
      />
    );

    const closeButton = getByText('Close');
    fireEvent.click(closeButton);

    expect(handleCloseFiltering).toBeCalled();
  });
});
