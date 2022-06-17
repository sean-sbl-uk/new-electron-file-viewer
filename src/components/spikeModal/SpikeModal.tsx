import React, { useState } from 'react';
import {
  Modal as BootstrapModal,
  Button,
  Form,
  Row,
  Col,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setSpikeData } from '../../redux/spikes';

type file = {
  name: string;
};

type Props = {
  show: boolean;
  files: file[];
  handleCloseModal: () => void;
};

interface Data {
  fileName: string;
  taxId: string;
  cellsPerMl: number;
  genomeSize: number;
}

const defaultSpikes: Data[] = [
  {
    fileName: 'spike1',
    taxId: '570278',
    cellsPerMl: 20000000,
    genomeSize: 2639468,
  },
  {
    fileName: 'spike2',
    taxId: '946077',
    cellsPerMl: 20000000,
    genomeSize: 3105306,
  },
];

const Modal: React.FC<Props> = (props) => {
  const { show, handleCloseModal, files } = props;

  const [multipleSpikes, setMultipleSpikes] = useState<boolean>(false);
  const [formData, setFormData] = useState<Data[]>(defaultSpikes);
  const [validated, setValidated] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = (e: any) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();

    if (form.checkValidity()) {
      //Send to redux store
      dispatch(setSpikeData(formData));

      handleCloseModal();

      //reset modal
      setMultipleSpikes(false);
    } else {
      //Maybe show alert
    }
    setValidated(true);
  };

  const handleClose = () => {
    handleCloseModal();
    setMultipleSpikes(false);
  };
  const onFormChange = (e: any) => {
    const id: string = e.target.id;
    const fileName: string = id.split('/')[1].trim();
    const key: '' = e.target.name;

    let index = formData.findIndex((obj) => obj.fileName === fileName);

    //If index is not in formData set index to end of array
    if (index < 0) {
      index = formData.length;
    }

    let tempState = [...formData];

    let tempElement = { ...tempState[index] };

    switch (key as any) {
      case 'taxId':
        tempElement.fileName = fileName;
        tempElement.taxId = e.target.value;
        break;
      case 'cellsPerMl':
        tempElement.fileName = fileName;
        tempElement.cellsPerMl = e.target.value;
        break;
      case 'genomeSize':
        tempElement.fileName = fileName;
        tempElement.genomeSize = e.target.value;
        break;
    }

    tempState[index] = tempElement;

    setFormData(tempState);
  };

  const spikeSwitchOnChange = () => {
    setMultipleSpikes(!multipleSpikes);
  };

  const inputFields = (fileName: string, defaultSpike?: Data) => {
    return (
      <Row className="mb-3">
        <Form.Group as={Col}>
          <Form.Control
            // required
            name="taxId"
            type="text"
            // {...fileName}
            id={`taxId/ ${fileName}`}
            placeholder="TaxId"
            onChange={onFormChange}
            defaultValue={defaultSpike ? defaultSpike.taxId : undefined}
          ></Form.Control>

          <Form.Control.Feedback type="invalid">
            Provide taxId
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Control
            // required
            name="cellsPerMl"
            type="number"
            // {...fileName}
            id={`cellsPerMl/ ${fileName}`}
            placeholder="Cells per ml"
            onChange={onFormChange}
            defaultValue={defaultSpike ? defaultSpike.cellsPerMl : undefined}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Provide cells per ml
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Control
            // required
            name="genomeSize"
            type="number"
            // {...fileName}
            id={`genomeSize/ ${fileName}`}
            placeholder="Genome Size"
            onChange={onFormChange}
            defaultValue={defaultSpike ? defaultSpike.genomeSize : undefined}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Provide genome size
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
    );
  };

  const formInputs =
    multipleSpikes && files ? (
      Array.from(files).map((file) => {
        let index = Array.from(files).indexOf(file);

        return (
          <div key={index} className="main-color">
            <Form.Label
              data-testid={`label-${file.name}`}
              className="col-form-label-lg"
            >
              {file.name}
            </Form.Label>

            {inputFields(file.name)}
          </div>
        );
      })
    ) : files[0] ? (
      <>
        <div className="main-color">
          {inputFields('Spike1', defaultSpikes[0])}
        </div>
        <div className="main-color">
          {inputFields('Spike2', defaultSpikes[1])}
        </div>
      </>
    ) : null;

  return (
    <BootstrapModal
      data-testid="modal"
      centered
      show={show}
      onHide={handleCloseModal}
    >
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title className="main-color">
          Spike Data
        </BootstrapModal.Title>
      </BootstrapModal.Header>
      <Form
        onSubmit={handleSubmit}
        className="needs-validation"
        noValidate
        validated={validated}
      >
        <BootstrapModal.Body>
          <Form.Check
            type="switch"
            id="spike-switch"
            label="Multiple Spikes"
            onChange={spikeSwitchOnChange}
            className="mb-3"
            data-testid="spike-switch"
          ></Form.Check>
          {formInputs}
        </BootstrapModal.Body>
        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="outline-secondary">
            Save Changes
          </Button>
        </BootstrapModal.Footer>{' '}
      </Form>
    </BootstrapModal>
  );
};

export default Modal;
