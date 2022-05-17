import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <div className="text-center">
      {" "}
      <Spinner className="" animation="grow" variant="secondary" />
    </div>
  );
};

export default Loader;
