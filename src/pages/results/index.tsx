import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../components/loader/Loader';
import store, { RootState } from '../../redux/store';
import { filterResults, reformatData } from '../../utils';
import Heatmap from '../../components/heatmap/Heatmap';
import { Button, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// import { FadeIn } from 'react-slide-fade-in';
import FadeIn from 'react-fade-in';
import Filters from '../../components/filters/Filters';
import { setResultsData } from '../../redux/results';
import { resetSpikeData } from '../../redux/spikes';
import Layout from '../../layouts/Layout';

const Results = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ReformatedData[]>();
  const [showFiltering, setShowFiltering] = useState(false);
  const [dataVisualization, setDataVisualization] = useState<string>('heatmap');
  const [color, setColor] = useState<string>('blues');

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
        bacteriaOn: true,
        virusOn: true,
        plasmidOn: true,
        hostOn: true,
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
    dispatch(resetSpikeData());
    navigate('/main', { replace: true });
  };

  const handleOpenFiltering = () => {
    setShowFiltering(true);
  };

  const handleCloseFiltering = () => {
    setShowFiltering(false);
  };

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

  const handleColorDropdown = (e: any) => {
    setColor(e);
  };

  const dropdownStyle = {
    width: '100%',
  };

  const content = (
    <div className="text-center results">
      {loading && <Loader />}
      {results && !loading && (
        <>
          <FadeIn>
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
                    <Dropdown.Item eventKey="heatmap">Heatmap</Dropdown.Item>
                    <Dropdown.Item disabled>Future Chart Opts...</Dropdown.Item>
                  </DropdownButton>
                </Col>

                <Row>
                  <DropdownButton
                    className="btn-block dropdown"
                    data-testid="color-dropdown"
                    title="Color"
                    onSelect={handleColorDropdown}
                    variant="secondary"
                    style={dropdownStyle}
                  >
                    <Dropdown.Item eventKey="blues">Blue</Dropdown.Item>
                    <Dropdown.Item eventKey="reds">Red</Dropdown.Item>
                    <Dropdown.Item eventKey="greens">Green</Dropdown.Item>
                    <Dropdown.Item eventKey="greys">Grey</Dropdown.Item>
                    <Dropdown.Item eventKey="blue_purple">
                      Blue/Purple
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="purpleRed_green">
                      Purple/Green
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="yellow_orange_red">
                      Yellow/Red
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="red_blue">Red/Blue</Dropdown.Item>
                    <Dropdown.Item eventKey="green_blue">
                      Green/Blue
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="red_yellow_blue">
                      Red/Yellow/Blue
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="warm">Warm</Dropdown.Item>
                    <Dropdown.Item eventKey="plasma">Plasma</Dropdown.Item>
                    <Dropdown.Item eventKey="turbo">Turbo</Dropdown.Item>
                    <Dropdown.Item eventKey="spectral">Spectral</Dropdown.Item>
                    <Dropdown.Item eventKey="rainbow">Rainbow</Dropdown.Item>
                  </DropdownButton>
                </Row>
              </Row>
            </div>

            <Heatmap results={results} setLoading={setLoading} color={color} />
          </FadeIn>
        </>
      )}

      <Filters
        show={showFiltering}
        handleCloseFiltering={handleCloseFiltering}
        handleFilterSubmit={handleFilterSubmit}
      />
    </div>
  );

  return <Layout title="Results">{content}</Layout>;
};

export default Results;
