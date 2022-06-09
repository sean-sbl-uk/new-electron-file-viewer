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

    ipcRenderer.on('analyse-files-reply', async (args: ProcessedFileData[]) => {
      dispatch(setResultsData(args));

      //filter top 10 hits per file by default
      let filter = {
        topHits: 10,
      };

      let filtered = await filterResults(args, filter);

      //After filtering add up all bacteria to set/unique list
      let bacteriaSet: Set<string> = new Set();

      filtered.forEach((file) => {
        file.data.forEach((bacteria) => {
          bacteriaSet.add(bacteria.name);
        });
      });

      let reformatedDataArray: ReformatedData[] = [];

      //For each bacteria
      bacteriaSet.forEach((bacteria) => {
        let dataArr: FileWithBacteriaAmount[] = [];

        //for each file
        args.forEach((fileData) => {
          //does the file have the bacteria
          let fileBacteriaObj: Bacteria | undefined = fileData.data.find(
            (fileBac) => fileBac.name === bacteria
          );

          //create obj
          let fileWithBacteriaAmount: FileWithBacteriaAmount =
            fileBacteriaObj == undefined
              ? {
                  fileName: fileData.fileName,
                  amount: 0,
                }
              : {
                  fileName: fileData.fileName,
                  amount: fileBacteriaObj.estimatedTotalAmount,
                };

          //add to array
          dataArr.push(fileWithBacteriaAmount);
        });

        //create final obj
        let reformedDataElement: ReformatedData = {
          bacteria: bacteria,
          data: dataArr,
        };

        //add to array
        reformatedDataArray.push(reformedDataElement);
      });

      console.log(reformatedDataArray);
      // setResults(filtered);
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
                {/* <Stack className="my-2" gap={2}> */}

                {/* <Container> */}
                {/* <div className="mt-2">
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
                </div> */}
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
