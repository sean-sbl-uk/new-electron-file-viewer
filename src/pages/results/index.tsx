import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../components/loader/Loader';
import store, { RootState } from '../../redux/store';
import { getGroupedDataArray } from '../../utils';
import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FadeIn from 'react-fade-in';

import { setResultsData } from '../../redux/results';
import { resetSpikeData } from '../../redux/spikes';
import Layout from '../../layouts/Layout';
import ResultsCard from '../../components/resultsCard/ResultsCard';

const Results = () => {
  const [loading, setLoading] = useState(true);
  const [groupedResults, setGroupedResults] =
    useState<GroupedReformatedData[]>();

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

      let groupedDataArray = await getGroupedDataArray(args, filter);

      setGroupedResults(groupedDataArray);
      setLoading(false);
    });

    ipcRenderer.sendMessage('analyse-files', args);
  }, []);

  const handleBackOnClick = () => {
    dispatch(resetSpikeData());
    navigate('/main', { replace: true });
  };

  const content = (
    <div className="text-center results">
      {loading && <Loader />}
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
              {groupedResults.map((group, index) => (
                <ResultsCard
                  key={index}
                  groupedData={group}
                  setLoading={setLoading}
                />
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
