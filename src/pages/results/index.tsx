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
      let filter: FilterData = {
        spikesOn: true,
        topHits: '10',
        minHitThreshold: 1,
      };

      //make spikes an optional parameter
      let filtered = await filterResults(args, allSpikeData, filter);

      //After filtering add up all bacteria to set/unique list
      let reformatedDataArray: ReformatedData[] = await format(args, filtered);

      setResults(reformatedDataArray);
      setLoading(false);
    });

    ipcRenderer.sendMessage('analyse-files', args);
  }, []);

  const format = async (
    fullResults: ProcessedFileData[],
    filtered: ProcessedFileData[]
  ): Promise<ReformatedData[]> => {
    let bacteriaSet: Set<Bacteria> = new Set();

    filtered.forEach((file) => {
      file.data.forEach((bacteria) => {
        bacteriaSet.add(bacteria);
      });
    });

    let reformatedDataArray: ReformatedData[] = await reformatData(
      bacteriaSet,
      fullResults
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
  const handleFilterSubmit = async (filters: FilterData) => {
    setLoading(true);
    setShowFiltering(false);

    const fullResults: ProcessedFileData[] = state?.results?.data;
    const spikes: Spikes[] = state?.spikeData?.data;

    if (fullResults) {
      let filtered = await filterResults(fullResults, spikes, filters);

      let reformatedDataArray: ReformatedData[] = await format(
        fullResults,
        filtered
      );

      setResults(reformatedDataArray);
      setLoading(false);
    }
  };

  const handleDropdownSelect = (e: any) => {
    setDataVisualization(e);
  };

  const dropdownStyle = {
    width: '100%',
  };

  return (
    <section data-testid="results" className="background">
      <div className="light-overlay">
        <Container>
          <div className="text-center results">
            {loading && <Loader />}
            {results && !loading && (
              <>
                <h1 className="my-4 main-color">Results</h1>
                <div className="mt-4 mb-4">
                  <Row xs={1} md={6} lg={8} className="justify-content-start">
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
                        className="btn-block dropdown"
                        data-testid="result-dropdown"
                        title="Data Visulazation"
                        onSelect={handleDropdownSelect}
                        variant="secondary"
                        style={dropdownStyle}
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
