import React, { useState } from 'react';
import { Modal as BootstrapModal, Form, Button } from 'react-bootstrap';

type Props = {
  handleCloseFiltering: () => void;
  handleFilterSubmit: (filterData: any) => void;
  show: boolean;
};

const Filters: React.FC<Props> = (props) => {
  const { handleCloseFiltering, handleFilterSubmit, show } = props;

  const [filterFormData, setFilterFormData] = useState<FilterData>({
    spikesOn: true,
    bacteriaOn: true,
    plasmidOn: true,
    hostOn: true,
    topHits: '10',
    minHitThreshold: 1,
  });

  const selectOptions = ['10', '20', '50', 'All'];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    handleFilterSubmit(filterFormData);
  };

  const switchOnChange = (e: any) => {
    let name: string = e.target.name;
    let objKey = name as keyof FilterData;
    let value: boolean = !filterFormData[objKey];
    setFilterFormData({ ...filterFormData, [objKey]: value });
  };

  const onFormChange = (e: any) => {
    setFilterFormData({
      ...filterFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <BootstrapModal
      data-testid={'filter-modal'}
      centered
      show={show}
      onHide={handleCloseFiltering}
    >
      <BootstrapModal.Header>
        <BootstrapModal.Title>Filters</BootstrapModal.Title>
      </BootstrapModal.Header>
      <Form onSubmit={handleSubmit}>
        <BootstrapModal.Body>
          <Form.Check
            name="spikesOn"
            type="switch"
            id="spike-switch"
            label="Spikes Off/On"
            onChange={switchOnChange}
            className="mb-3"
            data-testid="spike-switch"
            checked={filterFormData.spikesOn}
          ></Form.Check>
          <Form.Check
            name="bacteriaOn"
            type="switch"
            id="bacteria-switch"
            label="bacteria Off/On"
            onChange={switchOnChange}
            className="mb-3"
            data-testid="bacteria-switch"
            checked={filterFormData.bacteriaOn}
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
          <Button
            type="submit"
            variant="outline-secondary"
            onClick={handleSubmit}
          >
            Apply
          </Button>
        </BootstrapModal.Footer>
      </Form>
    </BootstrapModal>
  );
};

export default Filters;
