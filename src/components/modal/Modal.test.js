import React from 'react';
import Modal from './Modal';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { renderWithMockStore } from '../../utils/testUtils';

describe('Modal', () => {
  const files = [{ name: 'dummyFile1' }, { name: 'dummyFile2' }];

  //Needs updating
  const initialState = files;
  const mockStore = configureStore();
  let store, wrapper;

  it('should render', () => {
    const { getByTestId } = renderWithMockStore(
      <Modal show files={files} />,
      files
    );

    expect(getByTestId('modal')).toBeInTheDocument();
  });

  it('should display file name over input fields', () => {
    store = mockStore(initialState);
    const { getByTestId, getByText } = renderWithMockStore(
      <Modal show={true} files={files} />,
      files
    );

    const spikeSwitch = getByTestId('spike-switch');
    fireEvent.click(spikeSwitch);

    expect(getByText('dummyFile1')).toBeInTheDocument();
    expect(getByText('dummyFile2')).toBeInTheDocument();
  });

  // Hardcoded spikes for development
  // it('should display validation warnings input data missing', () => {
  //   store = mockStore(initialState);
  //   const { getByTestId, getByText } = render(
  //     <Provider store={store}>
  //       <Modal show={true} files={files} />
  //     </Provider>
  //   );

  //   const submit = getByText('Save Changes');
  //   fireEvent.click(submit);

  //   expect(getByText('Provide taxId')).toBeInTheDocument();
  // });
});
