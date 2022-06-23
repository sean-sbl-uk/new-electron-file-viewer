import React, { Children } from 'react';
import Container from '../components/container/Container';

interface Props {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<Props> = (props) => {
  const { children, title } = props;

  return (
    <section data-testid={title.toLowerCase} className="background font-oswald">
      <div className="light-overlay">
        <Container title={title}>{children}</Container>
      </div>
    </section>
  );
};

export default Layout;
