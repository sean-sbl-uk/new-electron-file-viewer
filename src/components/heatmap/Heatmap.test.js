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
      fileName: 'file1',
      amount: 12345,
    },
    {
      fileName: 'file2',
      amount: 12345,
    },
    {
      fileName: 'file3',
      amount: 12345,
    },
  ];

  const results = [
    {
      bacteria: 'bacteria1',
      data: data,
    },
    {
      bacteria: 'bacteria2',
      data: data,
    },
    {
      bacteria: 'bacteria3',
      data: data,
    },
  ];
  const mockFunc = jest.fn();

  it('should render', () => {
    const { getByTestId } = renderWithStore(
      <Heatmap results={results} setLoading={mockFunc} />
    );
    expect(getByTestId('heatmap')).toBeInTheDocument();
  });
});
