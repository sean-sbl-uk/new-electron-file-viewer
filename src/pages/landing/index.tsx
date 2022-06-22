import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Landing = () => {
  return (
    <section data-testid="landing" className="background">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="landing-heading">MicrobioMe File Viewer</h1>
          <p className="landing-subheading">
            Compare data from multiple BLAST CSV files
          </p>
          <Button className="btn-hover" variant="outline-light">
            <Link className="btn-link-outline landing-subheading" to="/main">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Landing;
