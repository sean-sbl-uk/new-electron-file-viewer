import React, { useState } from 'react';
import { Modal as BootstrapModal, Form, Button } from 'react-bootstrap';

type Props = {
  handleCloseFiltering: () => void;
  show: boolean;
};

interface FilterData {}

const Filters: React.FC<Props> = (props) => {
  const { handleCloseFiltering, show } = props;

  const [filterFormData, setFilterFormData] = useState();

  const selectOptions = ['10', '20', '50', 'All'];

  const handleSubmit = (e: any) => {
    console.log('Apply filter options');
    console.log(e.target);
  };

  const spikeSwitchOnChange = () => {};

  const hitThresholdOnChange = () => {};

  return (
    <BootstrapModal centered show={show} onHide={handleCloseFiltering}>
      <BootstrapModal.Header>
        <BootstrapModal.Title>Filters</BootstrapModal.Title>
      </BootstrapModal.Header>
      <Form onSubmit={handleSubmit}>
        <BootstrapModal.Body>
          <Form.Check
            type="switch"
            id="spike-switch"
            label="Spikes On/Off"
            onChange={spikeSwitchOnChange}
            className="mb-3"
            data-testid="spike-switch"
            disabled
          ></Form.Check>
          <Form.Group className="mb-3">
            <Form.Select defaultValue={'Top hits per cell'}>
              <option className="d-none form-text" value="">
                {' '}
                Top hits/cells per ml
              </option>
              {selectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              name="hitThreshold"
              type="number"
              placeholder="Min hit Threshold"
              disabled
              onChange={hitThresholdOnChange}
            ></Form.Control>
          </Form.Group>
        </BootstrapModal.Body>
        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={handleCloseFiltering}>
            Close
          </Button>
          <Button type="submit" variant="outline-secondary">
            Apply
          </Button>
        </BootstrapModal.Footer>
        {/* </Form.Control> */}
      </Form>
    </BootstrapModal>
  );
};

export default Filters;
