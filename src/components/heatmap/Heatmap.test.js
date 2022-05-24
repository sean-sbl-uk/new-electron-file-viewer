import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Heatmap from './Heatmap';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Results from 'pages/results';

describe('Heatmap', () => {
  const data = [
    {
      name: 'bacteria',
      taxId: '12345',
      recoverdAmount: 12345,
      estimatedTotalAmount: 12345,
    },
    {
      name: 'bacteria',
      taxId: '12345',
      recoverdAmount: 12345,
      estimatedTotalAmount: 12345,
    },
    {
      name: 'bacteria',
      taxId: '12345',
      recoverdAmount: 12345,
      estimatedTotalAmount: 12345,
    },
  ];
  const results = [
    { fileName: 'file 1', data: data },
    { fileName: 'file 2', data: data },
    { fileName: 'file 3', data: data },
  ];
  const mockFunc = jest.fn();

  it('should render', () => {
    const { getByTestId } = render(
      <Provider>
        <Heatmap results={results} setLoading={mockFunc} />
      </Provider>
    );
  });
});
