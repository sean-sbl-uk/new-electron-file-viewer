import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <div
      data-testid="loader"
      className="container-inner d-flex align-items-center justify-content-center text-center loader"
    >
      {' '}
      <Spinner className="" animation="grow" variant="secondary" />
    </div>
  );
};

export default Loader;
