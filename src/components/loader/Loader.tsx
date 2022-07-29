import { Spinner } from 'react-bootstrap';

type Props = {
  feedback: string;
};

const Loader: React.FC<Props> = (props) => {
  const { feedback } = props;
  return (
    <div
      data-testid="loader"
      className="container-inner d-flex align-items-center justify-content-center text-center loader"
    >
      {' '}
      <Spinner className="" animation="grow" variant="secondary" />
      <p className="main-color m-5">{feedback}</p>
    </div>
  );
};

export default Loader;
