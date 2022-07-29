import React, { useState } from 'react';
import {
  Modal as BootstrapModal,
  Form,
  Button,
  Row,
  Col,
} from 'react-bootstrap';

type Props = {
  group: string;
  handleCloseFiltering: () => void;
  handleFilterSubmit: (filterData: any) => void;
  show: boolean;
  filterData: FilterData;
};

const Filters: React.FC<Props> = (props) => {
  const { handleCloseFiltering, handleFilterSubmit, show, group, filterData } =
    props;

  const [filterFormData, setFilterFormData] = useState<FilterData>(filterData);

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

  let currentTopHits = filterFormData.topHits || 'DEFAULT';
  let currentScaleOpt = filterFormData.scaleOpt || 'DEAFAULT';
  return (
    <BootstrapModal
      data-testid={'filter-modal'}
      centered
      show={show}
      onHide={handleCloseFiltering}
      className="main-color"
    >
      <BootstrapModal.Header>
        <BootstrapModal.Title className="main-color font-bebas-neue">
          {`${group} Filters`}
        </BootstrapModal.Title>
      </BootstrapModal.Header>
      <Form onSubmit={handleSubmit}>
        <BootstrapModal.Body>
          {/* Checkboxes */}
          {group === 'ALL' && (
            <>
              <Row xs={1} md={4} lg={4} className="justify-content">
                <Col>
                  <Form.Check
                    name="spikesOn"
                    type="switch"
                    id="spike-switch"
                    label="Spikes"
                    onChange={switchOnChange}
                    className="mb-3"
                    data-testid="spike-switch"
                    checked={filterFormData.spikesOn}
                  ></Form.Check>
                </Col>
                <Col>
                  <Form.Check
                    name="bacteriaOn"
                    type="switch"
                    id="bacteria-switch"
                    label="Bacteria"
                    onChange={switchOnChange}
                    className="mb-3"
                    data-testid="bacteria-switch"
                    checked={filterFormData.bacteriaOn}
                  ></Form.Check>
                </Col>
                <Col>
                  <Form.Check
                    name="virusOn"
                    type="switch"
                    id="virus-switch"
                    label="Virus"
                    onChange={switchOnChange}
                    className="mb-3"
                    data-testid="virus-switch"
                    checked={filterFormData.virusOn}
                  ></Form.Check>
                </Col>

                <Col>
                  <Form.Check
                    name="plasmidOn"
                    type="switch"
                    id="plasmid-switch"
                    label="Plasmids"
                    onChange={switchOnChange}
                    className="mb-3"
                    data-testid="plasmid-switch"
                    checked={filterFormData.plasmidOn}
                  ></Form.Check>
                </Col>
              </Row>
              <Row xs={1} md={4} lg={4} className="justify-content">
                <Col>
                  <Form.Check
                    name="hostOn"
                    type="switch"
                    id="host-switch"
                    label="Host"
                    onChange={switchOnChange}
                    className="mb-3"
                    data-testid="host-switch"
                    checked={filterFormData.hostOn}
                  ></Form.Check>
                </Col>

                <Col>
                  <Form.Check
                    name="archaeaOn"
                    type="switch"
                    id="archaea-switch"
                    label="Archaea"
                    onChange={switchOnChange}
                    className="mb-3"
                    data-testid="archaea-switch"
                    checked={filterFormData.archaeaOn}
                  ></Form.Check>
                </Col>

                <Col>
                  <Form.Check
                    name="fungiOn"
                    type="switch"
                    id="fungi-switch"
                    label="Fungi"
                    onChange={switchOnChange}
                    className="mb-3"
                    data-testid="fungi-switch"
                    checked={filterFormData.fungiOn}
                  ></Form.Check>
                </Col>

                <Col>
                  <Form.Check
                    name="protozoaOn"
                    type="switch"
                    id="protozoa-switch"
                    label="Protozoa"
                    onChange={switchOnChange}
                    className="mb-3"
                    data-testid="protozoa-switch"
                    checked={filterFormData.protozoaOn}
                  ></Form.Check>
                </Col>
              </Row>
            </>
          )}

          {/* Top hits */}
          <Form.Group className="mb-3">
            <Form.Select
              onChange={onFormChange}
              name="topHits"
              placeholder="Top hits/cells per ml"
              aria-label="Top hits/cells per ml"
              value={currentTopHits}
            >
              <option value="DEFAULT" disabled>
                Top Hits/cells per ml...
              </option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={'All'}>All</option>
            </Form.Select>
          </Form.Group>

          {/* Hit threshold */}
          <Form.Group className="mb-3 main-color">
            <Form.Control
              name="minHitThreshold"
              type="number"
              placeholder="Min hit Threshold"
              onChange={onFormChange}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Select
              name="scaleOpt"
              placeholder="Scale Options"
              onChange={onFormChange}
              value={currentScaleOpt}
              data-testid="scale-options"
            >
              <option value="linear">Linear scale</option>
              <option value="logarithmic">Logarithmic scale (base-10)</option>
            </Form.Select>
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
