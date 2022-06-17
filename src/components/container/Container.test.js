import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Container from './Container';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { renderWithMockStore } from '../../utils/testUtils';

describe('Container', () => {
  it('should render', () => {
    const { getByTestId } = renderWithMockStore(<Container />);
    expect(getByTestId('container')).toBeInTheDocument();
  });
});
