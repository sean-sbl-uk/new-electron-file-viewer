/**
 * Main logic for calculating amount of bacteria in each file
 * @param spikeData
 * @param records
 * @returns
 */
//  export const processEachFile = (
//   spikeData: Spikes,
//   records: FileRecord[]
// ): Bacteria[] => {
//   let bacteriaArray: Bacteria[] = [];

//   let spikeTaxId: string = spikeData.taxId;
//   let spikeDNAInBp: number =
//     Number(spikeData.cellsPerMl) * Number(spikeData.genomeSize);

//   let spikeDNAOutBp: number = 0;
//   let spikeSubjectLen = 0;

//   records.forEach((record) => {
//     // count up all records for given spike
//     if (record.taxId === spikeTaxId) {
//       spikeSubjectLen = Number(record.subjectLen);
//       // let spikeTotal: number = Number(spikeDNAOutBp) + Number(record.queryLen);
//       spikeDNAOutBp += Number(record.queryLen);
//     } else {
//       //if not spike see if exists in bac array
//       if (!bacteriaArray.some((bacteria) => bacteria.taxId === record.taxId)) {
//         let newBacteria: Bacteria = {
//           name: record.subjectTitle,
//           taxId: record.taxId,
//           subjectLength: record.subjectLen,
//           recoveredAmount: Number(record.queryLen),
//           estimatedTotalAmount: 0,
//         };
//         bacteriaArray.push(newBacteria);
//       } else {
//         // count up all records for other species
//         let bacteriaIndex = bacteriaArray.findIndex(
//           (bacteria) => bacteria.taxId === record.taxId
//         );
//         let bacTotal =
//           Number(bacteriaArray[bacteriaIndex].recoveredAmount) +
//           Number(record.queryLen);
//         bacteriaArray[bacteriaIndex].recoveredAmount = bacTotal;
//       }
//     }
//   });

//   //If spikeDNAOutbp is 0 spike not in record

//   //use recovery ratio for multiple spikes then find the average.

//   let recoveryRatio = (spikeDNAOutBp / spikeDNAInBp) * 100.0;
//   let multiplier = 100.0 / recoveryRatio;

//   console.log('spike DNA out: ' + spikeDNAOutBp);
//   console.log('spike DNA in: ' + spikeDNAInBp);
//   console.log('spike subject len ' + spikeSubjectLen);
//   console.log('R.R :' + recoveryRatio);
//   console.log('multiplier: ' + multiplier + '\n');

//   // use recovery ratio to estimate cells in other species
//   bacteriaArray.forEach(
//     (bacteria) =>
//       (bacteria.estimatedTotalAmount =
//         (bacteria.recoveredAmount * multiplier) / bacteria.subjectLength)
//   );

//   return bacteriaArray;
// };

/**
 *
 * @param spikeData
 * @param records
 * @returns Bacteria[]
 */
export const processEachFileMultipleSpikes = (
  spikeData: Spikes[],
  records: FileRecord[]
): Bacteria[] => {
  let bacteriaArray: Bacteria[] = [];

  let spikeDNAIn: number = 0;
  let spikeDNAOut: number = 0;

  //count up spikes separtely
  spikeData.forEach((spike) => {
    const spikeRecords = records.filter(
      (record) => record.taxId === spike.taxId
    );

    if (spikeRecords) {
      spikeDNAIn += spike.cellsPerMl * spike.genomeSize;
      spikeRecords.forEach(
        (record) => (spikeDNAOut += Number(record.queryLen))
      );
    }
  });

  //No spike found in records
  if (spikeDNAOut === 0) {
    return bacteriaArray;
  }

  //calculate recovery ratio
  const recoveryRatio: number = spikeDNAIn / spikeDNAOut;

  //loop over records and count up all species
  records.forEach((record) => {
    if (!bacteriaArray.some((bacteria) => bacteria.taxId === record.taxId)) {
      let newBacteria: Bacteria = {
        name: record.subjectTitle,
        taxId: record.taxId,
        subjectLength: Number(record.subjectLen),
        recoveredAmount: Number(record.queryLen),
        estimatedTotalAmount: 0,
      };
      bacteriaArray.push(newBacteria);
    } else {
      // count up all records for other species
      let bacteriaIndex = bacteriaArray.findIndex(
        (bacteria) => bacteria.taxId === record.taxId
      );
      let bacTotal =
        Number(bacteriaArray[bacteriaIndex].recoveredAmount) +
        Number(record.queryLen);
      bacteriaArray[bacteriaIndex].recoveredAmount = bacTotal;
    }
  });

  bacteriaArray.forEach(
    (bacteria) =>
      (bacteria.estimatedTotalAmount =
        (bacteria.recoveredAmount * recoveryRatio) / bacteria.subjectLength)
  );

  //remove bad records
  bacteriaArray = bacteriaArray.filter(
    (bacteria) => bacteria.subjectLength > 0
    // bacteria.name.length > 0 ||
    // bacteria.taxId !== '0' ||
    // bacteria.estimatedTotalAmount !== Infinity
  );

  return bacteriaArray;
};

/**
 *
 * @param allFileRecords
 * @param allSpikeData
 * @returns ProcessedFileData[]
 */
export const processAllFiles = (
  allFileRecords: FileRecords[],
  allSpikeData: Spikes[]
): Promise<ProcessedFileData[]> => {
  const processedDataArray: ProcessedFileData[] = [];

  allFileRecords.forEach((file) => {
    // remove path to get file name
    let fileName: string = file.fileName.substring(
      file.fileName.lastIndexOf('/') + 1
    );

    let spikes =
      allSpikeData.length > 2
        ? // ? allSpikeData.find((spike) => spike.fileName === fileName)
          // :  allSpikeData[0];
          allSpikeData.filter((spike) => spike.fileName === fileName)
        : allSpikeData;

    let records = file.records;

    if (spikes && records) {
      // let data = processEachFile(spikes, records);
      let data = processEachFileMultipleSpikes(spikes, records);

      if (data.length > 0) {
        const processedFileData: ProcessedFileData = {
          fileName: fileName,
          data: data,
        };

        processedDataArray.push(processedFileData);
      }
    }
  });

  return Promise.resolve(processedDataArray);
};

/**
 * Runs all the filters on the data set
 * @param results
 * @param filters
 * @returns
 */
export const filterResults = (
  results: ProcessedFileData[],
  filters: any
): ProcessedFileData[] => {
  const result: ProcessedFileData[] = [];

  results = topHitsFilter(filters, results);

  return result;
};

/**
 * Filters out bacteria not in the top no of hits
 * @param filters
 * @param results
 * @returns
 */
const topHitsFilter = (
  filters: any,
  results: ProcessedFileData[]
): ProcessedFileData[] => {
  if (filters.topHits == 'All') return results;

  results.forEach((file) => {
    let topHits: Bacteria[] = [];

    let sortedData = file.data.sort(
      (a, b) => b.estimatedTotalAmount - a.estimatedTotalAmount
    );

    topHits =
      sortedData > filters.topHits
        ? file.data.slice(0, +filters.topHits + 1)
        : file.data;

    file.data = topHits;
  });
  return results;
};
