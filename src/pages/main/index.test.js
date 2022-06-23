import React from 'react';
import Main from '.';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { renderWithStore } from '../../utils/testUtils';

describe('Main', () => {
  it('should render', () => {
    const { getByTestId } = renderWithStore(<Main />);

    expect(getByTestId('File Upload')).toBeInTheDocument();
  });
});
