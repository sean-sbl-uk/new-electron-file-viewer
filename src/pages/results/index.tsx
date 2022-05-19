import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import Loader from '../../components/loader/Loader';
import { RootState } from '../../redux/store';
import { processAllFiles } from 'utils';

// interface ProcessedFileData {
//   name: string;
//   data: Bacteria[];
// }

const Results = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ProcessedFileData[]>();

  const allFileRecords = useSelector((state: RootState) => state.records.data);
  const allSpikeData = useSelector((state: RootState) => state.spikeData.data);

  // console.log(allFileRecords);
  // console.log(allSpikeData);
  console.log(results);
  useEffect(() => {
    (async () => {
      const processedDataArray = await processAllFiles(
        allFileRecords,
        allSpikeData
      );

      if (processedDataArray.length > 0) {
        setResults(processedDataArray);
        setLoading(false);
      }
    })();

    return () => {};
  }, [allSpikeData, allFileRecords]);

  return (
    <section className="background">
      <div className="light-overlay">
        <Container className="">
          <div className="text-center row">
            <h1 className="my-4 main-color">Results</h1>

            {loading && <Loader />}
            {results && <div>Heatmap</div>}
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Results;
