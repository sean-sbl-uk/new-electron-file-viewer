import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../components/loader/Loader';
import store, { RootState } from '../../redux/store';
import { filterResults, reformatData } from '../../utils';
import Heatmap from '../../components/heatmap/Heatmap';
import Container from '../../components/container/Container';
import { Button, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Filters from '../../components/filters/Filters';
import { setResultsData } from '../../redux/results';

const Results = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ReformatedData[]>();
  const [showFiltering, setShowFiltering] = useState(false);
  const [dataVisualization, setDataVisualization] = useState<string>('heatmap');

  const allFileRecords = useSelector((state: RootState) => state.records.data);
  const allSpikeData = useSelector((state: RootState) => state.spikeData.data);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ipcRenderer = window.electron.ipcRenderer;
  const state = store.getState();

  useEffect(() => {
    const fileArray = Array.from(state?.files?.data);

    const args = {
      fileArray,
      allSpikeData,
    };

    ipcRenderer.on('analyse-files-reply', async (args: ProcessedFileData[]) => {
      dispatch(setResultsData(args));

      //filter top 10 hits per file by default
      let filter = {
        topHits: 10,
      };

      let filtered = await filterResults(args, filter);

      //After filtering add up all bacteria to set/unique list
      let reformatedDataArray: ReformatedData[] = await format(filtered);

      setResults(reformatedDataArray);
      setLoading(false);
    });

    ipcRenderer.sendMessage('analyse-files', args);
  }, []);

  const format = async (
    args: ProcessedFileData[]
  ): Promise<ReformatedData[]> => {
    let bacteriaSet: Set<string> = new Set();

    args.forEach((file) => {
      file.data.forEach((bacteria) => {
        bacteriaSet.add(bacteria.name);
      });
    });

    let reformatedDataArray: ReformatedData[] = await reformatData(
      bacteriaSet,
      args
    );

    return reformatedDataArray;
  };

  const handleBackOnClick = () => {
    navigate('/main', { replace: true });
  };

  const handleOpenFiltering = () => {
    setShowFiltering(true);
  };

  const handleCloseFiltering = () => {
    setShowFiltering(false);
  };

  // TODO
  const handleFilterSubmit = async (filters: any) => {
    setLoading(true);
    setShowFiltering(false);

    const fullResults = state?.results?.data;

    if (fullResults) {
      let filtered = await filterResults(fullResults, filters);

      let reformatedDataArray: ReformatedData[] = await format(filtered);

      setResults(reformatedDataArray);
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
          <div className="text-center">
            {loading && <Loader />}
            {results && !loading && (
              <>
                <h1 className="my-4 main-color">Results</h1>
                <div className="mt-4 mb-4">
                  <Row>
                    <Col>
                      <Button
                        className="btn-hover btn-block"
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
                        className="btn-block"
                        data-testid="result-dropdown"
                        title="Data Visulazation"
                        onSelect={handleDropdownSelect}
                        variant="secondary"
                        style={{ width: '100%' }}
                      >
                        <Dropdown.Item eventKey="heatmap">
                          Heatmap
                        </Dropdown.Item>
                        <Dropdown.Item disabled>Line Chart</Dropdown.Item>
                      </DropdownButton>
                    </Col>
                  </Row>
                </div>
                <Heatmap results={results} setLoading={setLoading} />
              </>
            )}

            <Filters
              show={showFiltering}
              handleCloseFiltering={handleCloseFiltering}
              handleFilterSubmit={handleFilterSubmit}
            />
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Results;
