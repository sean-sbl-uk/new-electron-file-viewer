import Results from '.';
import '@testing-library/jest-dom';

import { renderWithStore } from '../../utils/testUtils';

window.electron = {
  ipcRenderer: {
    on: jest.fn().mockReturnValue([]),
    sendMessage: jest.fn(),
  },
};

describe('Results', () => {
  it('should render', () => {
    const { getByTestId } = renderWithStore(<Results />);
    expect(getByTestId('results')).toBeInTheDocument();
  });

  it('should show loading animation when navigating to page', () => {
    const { getByTestId } = renderWithStore(<Results />);
    expect(getByTestId('loader')).toBeInTheDocument();
  });
});
