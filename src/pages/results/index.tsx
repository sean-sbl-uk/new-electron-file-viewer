import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../components/loader/Loader';
import store, { RootState } from '../../redux/store';
import { reformatData, groupData } from '../../utils';

import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// import { FadeIn } from 'react-slide-fade-in';
import FadeIn from 'react-fade-in';

import { setResultsData } from '../../redux/results';
import { resetSpikeData } from '../../redux/spikes';
import Layout from '../../layouts/Layout';
import ResultsCard from '../../components/resultsCard/ResultsCard';

const Results = () => {
  const [loading, setLoading] = useState(true);
  // const [results, setResults] = useState<ReformatedData[]>();
  const [groupedResults, setGroupedResults] =
    useState<GroupedReformatedData[]>();
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
      // let filtered = await filterResults(args, allSpikeData, filter);

      // //After filtering add up all bacteria to set/unique list
      // let reformatedDataArray: ReformatedData[] = await format(args, filtered);

      // setResults(reformatedDataArray);
      // setLoading(false);

      //group subj group
      let groupedRes = await groupData(args, allSpikeData, filter);

      setGroupedResults(groupedRes);
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

  // const handleOpenFiltering = () => {
  //   setShowFiltering(true);
  // };

  // const handleCloseFiltering = () => {
  //   setShowFiltering(false);
  // };

  // const handleFilterSubmit = async (filters: FilterData) => {
  //   setLoading(true);
  //   setShowFiltering(false);

  //   const fullResults: ProcessedFileData[] = state?.results?.data;
  //   const spikes: Spikes[] = state?.spikeData?.data;

  //   if (fullResults) {
  //     let filtered = await filterResults(fullResults, spikes, filters);

  //     let reformatedDataArray: ReformatedData[] = await format(
  //       fullResults,
  //       filtered
  //     );

  //     setResults(reformatedDataArray);
  //     setLoading(false);
  //   }
  // };

  // const handleDropdownSelect = (e: any) => {
  //   setDataVisualization(e);
  // };

  // const handleColorDropdown = (e: any) => {
  //   setColor(e);
  // };

  // const dropdownStyle = {
  //   width: '100%',
  // };

  const content = (
    <div className="text-center results">
      {loading && <Loader />}
      {/* {results && !loading && ( */}
      {groupedResults && !loading && (
        <>
          <FadeIn>
            <>
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
                </Row>
              </div>

              {/* After grouping map each to results card */}
              {console.log(groupedResults)}
              {groupedResults.map((group) => (
                <ResultsCard groupedData={group} setLoading={setLoading} />
              ))}
            </>
          </FadeIn>
        </>
      )}
    </div>
  );

  return <Layout title="Results">{content}</Layout>;
};

export default Results;
