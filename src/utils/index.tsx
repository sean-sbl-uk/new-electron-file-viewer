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
        ? allSpikeData.filter((spike) => spike.fileName === fileName)
        : allSpikeData;

    let records = file.records;

    if (spikes && records) {
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
export const filterResults = async (
  results: ProcessedFileData[],
  spikes: Spikes[],
  filters: FilterData
): Promise<ProcessedFileData[]> => {
  let result: ProcessedFileData[] = [];

  result = await topHitsFilter(filters, results);
  // result =
  //   filters.spikesOn && spikes ? result : await spikesOnFilter(spikes, results);

  return result;
};

/**
 * Filters out spikes from results
 * @param filters
 * @param spikes
 * @param results
 * @returns
 */
const spikesOnFilter = (
  spikes: Spikes[],
  results: ProcessedFileData[]
): ProcessedFileData[] | any[] => {
  console.log('spikesOnFilter ');
  let result: ProcessedFileData[] = results.map((file) => {
    let data: Bacteria[] = file.data.filter((bacteria) => {
      spikes.some((spike) => {
        spike.taxId !== bacteria.taxId;
      });
    });
    return {
      fileName: file.fileName,
      data: data,
    };
  });

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

  results = results.map((file) => {
    let topHits: Bacteria[] = [];

    let copy: Bacteria[] = [...file.data];

    let sortedData = copy.sort(
      (a, b) => b.estimatedTotalAmount - a.estimatedTotalAmount
    );

    topHits =
      sortedData.length > filters.topHits
        ? sortedData.slice(0, filters.topHits)
        : sortedData;

    let result: ProcessedFileData = {
      fileName: file.fileName,
      data: topHits,
    };

    return result;
  });

  return results;
};

export const reformatData = (
  bacteriaSet: Set<string>,
  processedFileDataArr: ProcessedFileData[]
): Promise<ReformatedData[]> => {
  let reformatedDataArray: ReformatedData[] = [];

  bacteriaSet.forEach((bacteria) => {
    let dataArr: FileWithBacteriaAmount[] = [];

    //for each file
    processedFileDataArr.forEach((fileData) => {
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

  return Promise.resolve(reformatedDataArray);
};
