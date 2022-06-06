import React from 'react';
import Landing from './index';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { store } from '../../redux/store';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { renderWithStore } from '../../utils/testUtils';

describe('Landing', () => {
  it('should render', () => {
    const { getByTestId } = renderWithStore(<Landing />);

    expect(getByTestId('landing')).toBeInTheDocument();
  });
});
