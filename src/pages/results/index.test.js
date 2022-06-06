import React from 'react';
import Results from '.';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import store from '../../redux/store';
import { renderWithStore } from '../../utils/testUtils';

window.electron = {
  ipcRenderer: {
    on: jest.fn(),
    sendMessage: jest.fn(),
  },
};

describe('Results', () => {
  it('should render', () => {
    const { getByTestId } = renderWithStore(<Results />);

    expect(getByTestId('results')).toBeInTheDocument();
  });
});
