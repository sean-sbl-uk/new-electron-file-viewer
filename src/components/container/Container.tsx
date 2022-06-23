import React from 'react';
import { Row, Col } from 'react-bootstrap';
interface Props {
  children: React.ReactNode;
  title: string;
}

const Container: React.FC<Props> = (props) => {
  const { children, title } = props;
  return (
    <>
      {/* <Row className='justify-content-center'>
      <Col>

      </Col>
      <Col>
      </Col>
    </Row> */}
      <div className="title-div container d-flex align-items-center justify-content-around">
        <h1 className="my-8 main-color page-title">{title}</h1>

        <hr className="hr" />
      </div>
      <div
        data-testid="container"
        className="container-inner d-flex align-items-center justify-content-center"
      >
        {children}
      </div>
    </>
  );
};

export default Container;
