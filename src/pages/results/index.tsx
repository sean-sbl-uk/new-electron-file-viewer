import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../components/loader/Loader';
import { RootState } from '../../redux/store';
import { processAllFiles } from '../../utils';
import Heatmap from '../../components/heatmap/Heatmap';
import Container from '../../components/container/Container';
import { Button, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Filters from '../../components/filters/Filters';

const Results = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ProcessedFileData[]>();
  const [showFiltering, setShowFiltering] = useState(false);

  const allFileRecords = useSelector((state: RootState) => state.records.data);
  const allSpikeData = useSelector((state: RootState) => state.spikeData.data);
  // pull down filter state from store

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const processedDataArray = await processAllFiles(
        allFileRecords,
        allSpikeData
      );

      // have filter method in utils filterResults(results, filters)
      // run through filter then set as results
      if (processedDataArray.length > 0) {
        setResults(processedDataArray);
        setLoading(false);
      }
    })();

    return () => {};
  }, [allSpikeData, allFileRecords]);

  const handleBackOnClick = () => {
    navigate('/main', { replace: true });
  };

  const handleOpenFiltering = () => {
    setShowFiltering(true);
  };

  const handleCloseFiltering = () => {
    setShowFiltering(false);
  };

  //Change name
  const handleFilterSubmit = (filters: any) => {
    setLoading(true);
    setShowFiltering(false);
    console.log(filters);

    // have filter method in utils filterResults(results, filters)
    // run through filter then set as results
    setLoading(false);
  };

  return (
    <section className="background">
      <div className="light-overlay">
        <Container>
          <div className="text-center row">
            {loading && <Loader />}
            {results && !loading && (
              <>
                <h1 className="my-4 main-color">Results</h1>
                <Heatmap results={results} setLoading={setLoading} />

                <Stack className="my-2" gap={2}>
                  <Button variant="secondary" onClick={handleOpenFiltering}>
                    Filtering
                  </Button>

                  <Button
                    className="btn-hover"
                    variant="outline-secondary"
                    onClick={handleBackOnClick}
                  >
                    Back
                  </Button>
                </Stack>
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
