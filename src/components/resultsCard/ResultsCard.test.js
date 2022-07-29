import React from 'react';
import '@testing-library/jest-dom';
import {
  fireEvent,
  getByTestId,
  render,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { renderWithMockStore } from '../../utils/testUtils';
import configureStore from 'redux-mock-store';
import ResultsCard from './ResultsCard';
import { act } from 'react-test-renderer';

describe('results card', () => {
  const initialState = {};
  const mockStore = configureStore();
  const store = mockStore(initialState);
  const setLoading = jest.fn();

  const file1 = {
    fileName: 'file1',
    amount: 1,
  };

  const file2 = {
    fileName: 'file2',
    amount: 2,
  };

  const data = {
    bacteria: 'test-bac',
    data: [file1, file2],
  };

  const groupedData = {
    group: 'Test Group',
    data: [data],
  };

  it('should render', () => {
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <ResultsCard
          key={1}
          groupedData={groupedData}
          setLoading={setLoading}
        />
      </Provider>
    );
    expect(setLoading).toBeCalled();
    expect(getByText('Test Group')).toBeInTheDocument();
  });

  it('should bring up filtering modal on button click', () => {
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <ResultsCard
          key={1}
          groupedData={groupedData}
          setLoading={setLoading}
        />
      </Provider>
    );

    const filtering = getByText('Filtering');
    fireEvent.click(filtering);

    expect(getByTestId('filter-modal')).toBeInTheDocument();
  });

  it('should bring up color opts on button click', async () => {
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <ResultsCard
          key={1}
          groupedData={groupedData}
          setLoading={setLoading}
        />
      </Provider>
    );

    const colorOpts = getByText('Color');
    await waitFor(() => {
      fireEvent.click(colorOpts);
      expect(getByText('Blue')).toBeInTheDocument();
      expect(getByText('Red')).toBeInTheDocument();
      expect(getByText('Green')).toBeInTheDocument();
    });
  });
});
