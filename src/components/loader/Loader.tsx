import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <div data-testid="loader" className="text-center">
      {' '}
      <Spinner className="" animation="grow" variant="secondary" />
    </div>
  );
};

export default Loader;
