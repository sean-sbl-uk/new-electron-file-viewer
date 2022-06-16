import '@testing-library/jest-dom';
import Heatmap from './Heatmap';
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
  const setLoading = jest.fn();

  it('should render', () => {
    const { getByTestId } = renderWithStore(
      <Heatmap results={results} setLoading={setLoading} />
    );
    expect(getByTestId('heatmap')).toBeInTheDocument();
  });

  it('should set loading animation to false when heatmap data loaded', () => {
    const { getByTestId } = renderWithStore(
      <Heatmap results={results} setLoading={setLoading} />
    );

    expect(setLoading).toBeCalledWith(false);
  });
});
