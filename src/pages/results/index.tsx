import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../components/loader/Loader';
import store, { RootState } from '../../redux/store';
import { filterResults } from '../../utils';
import Heatmap from '../../components/heatmap/Heatmap';
import Container from '../../components/container/Container';
import {
  Button,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Stack,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Filters from '../../components/filters/Filters';
import { setResultsData } from '../../redux/results';

const Results = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ProcessedFileData[]>();
  const [showFiltering, setShowFiltering] = useState(false);
  const [dataVisualization, setDataVisualization] = useState<string>('heatmap');

  const allFileRecords = useSelector((state: RootState) => state.records.data);
  const allSpikeData = useSelector((state: RootState) => state.spikeData.data);
  // const fullResults = useSelector((state: RootState) => state.results.data);
  // pull down filter state from store

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ipcRenderer = window.electron.ipcRenderer;
  const state = store.getState();

  useEffect(() => {
    console.log(state);
    const fileArray = Array.from(state?.files?.data);

    const args = {
      fileArray,
      allSpikeData,
    };

    ipcRenderer.on('analyse-files-reply', async (args: any) => {
      dispatch(setResultsData(args));

      //filter top 10 hits per file by default
      let filter = {
        topHits: 10,
      };

      let filtered = await filterResults(args, filter);

      setResults(filtered);
      setLoading(false);
    });

    ipcRenderer.sendMessage('analyse-files', args);
  }, []);

  const handleBackOnClick = () => {
    navigate('/main', { replace: true });
  };

  const handleOpenFiltering = () => {
    setShowFiltering(true);
  };

  const handleCloseFiltering = () => {
    setShowFiltering(false);
  };

  const handleFilterSubmit = async (filters: any) => {
    setLoading(true);
    setShowFiltering(false);

    // const state = store.getState();

    const fullResults = state?.results?.data;

    if (fullResults) {
      let filteredResults = await filterResults(fullResults, filters);
      setResults(filteredResults);
      setLoading(false);
    }
  };

  const handleDropdownSelect = (e: any) => {
    setDataVisualization(e);
  };

  return (
    <section data-testid="results" className="background">
      <div className="light-overlay">
        <Container>
          {/* <div className="text-center row"> */}
          <div className="text-center">
            {loading && <Loader />}
            {results && !loading && (
              <>
                <h1 className="my-4 main-color">Results</h1>
                <Heatmap results={results} setLoading={setLoading} />
                {/* <Stack className="my-2" gap={2}> */}

                {/* <Container> */}
                <div className="mt-2">
                  <Row>
                    <Col>
                      <Button
                        className="btn-hover brn-block"
                        variant="outline-secondary"
                        onClick={handleBackOnClick}
                        style={{ width: '100%' }}
                      >
                        Back
                      </Button>{' '}
                    </Col>
                    <Col>
                      <Button
                        className="mr-1 btn-block"
                        variant="secondary"
                        onClick={handleOpenFiltering}
                        style={{ width: '100%' }}
                      >
                        Filtering
                      </Button>{' '}
                    </Col>

                    <Col>
                      <DropdownButton
                        data-testid="result-dropdown"
                        title="Data Visulazation"
                        onSelect={handleDropdownSelect}
                        variant="secondary"
                      >
                        <Dropdown.Item eventKey="heatmap">
                          Heatmap
                        </Dropdown.Item>
                        <Dropdown.Item disabled>Line Chart</Dropdown.Item>
                      </DropdownButton>
                    </Col>
                  </Row>
                </div>
                {/* </Stack> */}
                {/* </Container> */}
              </>
            )}

            <Filters
              show={showFiltering}
              handleCloseFiltering={handleCloseFiltering}
              handleFilterSubmit={handleFilterSubmit}
            />
          </div>

          {/* <Button variant="secondary" onClick={handleOpenFiltering}>
            Filtering
          </Button>{' '}
          <Button
            className="btn-hover"
            variant="outline-secondary"
            onClick={handleBackOnClick}
          >
            Back
          </Button>{' '} */}
        </Container>
      </div>
    </section>
  );
};

export default Results;
