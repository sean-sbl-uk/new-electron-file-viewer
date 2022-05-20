import React from 'react';
import { Container as BootstrapContainer } from 'react-bootstrap';

interface Props {
  children: React.ReactNode;
}

const Container: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <div className="container-inner">
      <BootstrapContainer className="d-flex align-items-center justify-content-center">
        {children}
      </BootstrapContainer>
    </div>
  );
};

export default Container;
