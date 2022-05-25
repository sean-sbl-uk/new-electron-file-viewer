import React, { useState } from 'react';
import { Modal as BootstrapModal, Form, Button } from 'react-bootstrap';
import spikes from 'redux/spikes';

type Props = {
  handleCloseFiltering: () => void;
  handleFilterSubmit: (filterData: any) => void;
  show: boolean;
};

type FilterData = {
  spikesOn: boolean;
  topHits: string;
  minHitThreshold: number;
};

const Filters: React.FC<Props> = (props) => {
  const { handleCloseFiltering, handleFilterSubmit, show } = props;

  const [filterFormData, setFilterFormData] = useState<FilterData | any>(null);

  // console.log(filterFormData);

  const selectOptions = ['10', '20', '50', 'All'];

  const handleSubmit = (e: any) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();

    handleFilterSubmit(filterFormData);
  };

  const spikeSwitchOnChange = () => {
    let value = !filterFormData.spikesOn;
    setFilterFormData({ ...filterFormData, [filterFormData.spikesOn]: value });
  };

  // const topHitsPerCellOnChange = (e: any) => {};

  // const hitThresholdOnChange = () => {};

  const onFormChange = (e: any) => {
    setFilterFormData({
      ...filterFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <BootstrapModal centered show={show} onHide={handleCloseFiltering}>
      <BootstrapModal.Header>
        <BootstrapModal.Title>Filters</BootstrapModal.Title>
      </BootstrapModal.Header>
      <Form onSubmit={handleSubmit}>
        <BootstrapModal.Body>
          <Form.Check
            name="spikesOn"
            type="switch"
            id="spike-switch"
            label="Spikes On/Off"
            onChange={spikeSwitchOnChange}
            className="mb-3"
            data-testid="spike-switch"
            disabled
          ></Form.Check>
          <Form.Group className="mb-3">
            <Form.Select
              defaultValue={'Top hits per cell'}
              onChange={onFormChange}
              name="topHits"
            >
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
              onChange={onFormChange}
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
      </Form>
    </BootstrapModal>
  );
};

export default Filters;
