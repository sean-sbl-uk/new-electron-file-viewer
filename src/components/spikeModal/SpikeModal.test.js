import React from 'react';
import Modal from './SpikeModal';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';

import configureStore from 'redux-mock-store';
import { renderWithMockStore } from '../../utils/testUtils';

describe('Modal', () => {
  const files = [{ name: 'dummyFile1' }, { name: 'dummyFile2' }];

  //Needs updating
  const initialState = files;
  const mockStore = configureStore();
  let store, wrapper;

  const handleCloseModal = jest.fn();

  it('should render', () => {
    const { getByTestId } = renderWithMockStore(
      <Modal show files={files} />,
      files
    );

    expect(getByTestId('modal')).toBeInTheDocument();
  });

  it('should display file name over input fields when spike swith clicked', () => {
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

  it('should close modal on submit', () => {
    const { getByText } = renderWithMockStore(
      <Modal show={true} files={files} handleCloseModal={handleCloseModal} />
    );

    const saveButton = getByText('Save Changes');
    fireEvent.click(saveButton);

    expect(handleCloseModal).toBeCalled();
  });
});
