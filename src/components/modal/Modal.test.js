import React from "react";
import Modal from "./Modal";
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";

import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

describe("Modal", () => {
  const files = [{ name: "dummyFile1" }, { name: "dummyFile2" }];
  //Needs updating
  const initialState = files;
  const mockStore = configureStore();
  let store, wrapper;

  it("should render", () => {
    store = mockStore(initialState);
    const { getByTestId } = render(
      <Provider store={store}>
        {" "}
        <Modal show={true} />
      </Provider>
    );

    expect(getByTestId("modal")).toBeInTheDocument();
  });

  it("should display file name over input fields", () => {
    store = mockStore(initialState);
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <Modal show={true} files={files} />
      </Provider>
    );

    const spikeSwitch = getByTestId("spike-switch");
    fireEvent.click(spikeSwitch);

    expect(getByText("dummyFile1")).toBeInTheDocument();
    expect(getByText("dummyFile2")).toBeInTheDocument();
  });

  it("should display validation warnings input data missing", () => {
    store = mockStore(initialState);
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <Modal show={true} files={files} />
      </Provider>
    );

    const submit = getByText("Save Changes");
    fireEvent.click(submit);

    expect(getByText("Provide taxId")).toBeInTheDocument();
  });
});
