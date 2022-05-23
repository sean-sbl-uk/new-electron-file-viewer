import React from 'react';
import { Modal as BootstrapModal, Form, Button } from 'react-bootstrap';

type Props = {
  handleCloseFiltering: () => void;
  show: boolean;
};

const Filters: React.FC<Props> = (props) => {
  const { handleCloseFiltering, show } = props;

  const handleSubmit = (e: any) => {
    console.log('Apply filter options');
    console.log(e.target);
  };

  return (
    <BootstrapModal centered show={show} onHide={handleCloseFiltering}>
      <BootstrapModal.Header>
        <BootstrapModal.Title>Filters</BootstrapModal.Title>
      </BootstrapModal.Header>
      <Form onSubmit={handleSubmit}>
        <BootstrapModal.Body>sliders, toggles etc</BootstrapModal.Body>
        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={handleCloseFiltering}>
            Close
          </Button>
          <Button type="submit" variant="outline-secondary">
            Apply
          </Button>
        </BootstrapModal.Footer>
      </Form>
    </BootstrapModal>
  );
};

export default Filters;
