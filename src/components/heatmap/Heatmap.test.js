import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Heatmap from './Heatmap';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Results from 'pages/results';
import { renderWithMockStore } from '../../utils/testUtils';

// jest.mock('reaviz', () => ({
//   __esModule: true,
//   Heatmap: (props) => <div {...props}> Hello</div>,
//   SequentialLegend: (props) => <div {...props}> Hello</div>,
//   HeatmapSeries: () => <div> Hello</div>,
// }));

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
  // const mockStore = configureStore();
  // const initialState = {};

  it('should render', () => {
    // const store = mockStore(initialState);
    // const { getByTestId } = render(
    //   <Provider store={store}>
    //     <Heatmap results={results} setLoading={mockFunc} />
    //   </Provider>
    // );

    const { getByTestId } = renderWithMockStore(
      <Heatmap results={results} setLoading={mockFunc} />
    );
    expect(getByTestId('heatmap')).toBeInTheDocument();
  });
});
