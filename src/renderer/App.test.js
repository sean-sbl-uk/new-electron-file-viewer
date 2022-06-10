import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from './App';

jest.mock('reaviz', () => ({
  __esModule: true,
  Heatmap: () => <div> Hello</div>,
  SequentialLegend: (props) => <div {...props}> Hello</div>,
  HeatmapSeries: () => <div> Hello</div>,
}));

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
