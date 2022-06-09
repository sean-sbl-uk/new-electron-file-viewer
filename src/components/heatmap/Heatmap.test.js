import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Heatmap from './Heatmap';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Results from 'pages/results';
import { renderWithStore } from '../../utils/testUtils';

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

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
    const { getByTestId } = renderWithStore(
      <Heatmap results={results} setLoading={mockFunc} />
    );
    expect(getByTestId('heatmap')).toBeInTheDocument();
  });
});
