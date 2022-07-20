/**
 * Process each individual file with using multiple spikes
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
        subjectGroup: record.subjectGroup,
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
 * Takes in list of files and spikes and begins process
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
 * @param results The full results pre any filtering
 * @param filters
 * @returns
 */
// export const filterResults = async (
//   results: ProcessedFileData[],
//   spikes: Spikes[],
//   filters: FilterData
// ): Promise<ProcessedFileData[]> => {
//   let result: ProcessedFileData[] = [];

//   result = await topHitsFilter(filters, results);

//   result =
//     filters.spikesOn && spikes ? result : await spikesOnFilter(spikes, result);

//   result = filters.bacteriaOn ? result : await bacteriaOnFilter(result);
//   result = filters.virusOn ? result : await virusOnFilter(result);
//   result = filters.plasmidOn ? result : await plasmidOnFilter(result);
//   result = filters.hostOn ? result : await hostOnFilter(result);

//   return Promise.resolve(result);
// };

// Make all checkbox filters async?
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
  let spikeTaxIds: string[] = spikes.map((spike) => spike.taxId);
  let result: ProcessedFileData[] = results.map((file) => {
    let data: Bacteria[] = file.data.filter((bacteria) => {
      // return !spikeTaxIds.includes(bacteria.taxId);
      return bacteria.subjectGroup === 'SPIKE';
    });

    return {
      fileName: file.fileName,
      data: data,
    };
  });

  return result;
};

/**
 * Filters out bacteria
 * @param results
 * @returns
 */
const bacteriaOnFilter = (
  results: ProcessedFileData[]
): ProcessedFileData[] | any[] => {
  let result: ProcessedFileData[] = results.map((file) => {
    let data: Bacteria[] = file.data.filter((bacteria) => {
      return bacteria.subjectGroup === 'BACTERIA';
    });

    return {
      fileName: file.fileName,
      data: data,
    };
  });

  // console.log(result);
  return result;
};

const virusOnFilter = (
  results: ProcessedFileData[]
): ProcessedFileData[] | any[] => {
  let result: ProcessedFileData[] = results.map((file) => {
    let data: Bacteria[] = file.data.filter((bacteria) => {
      return bacteria.subjectGroup === 'VIRUS';
    });

    return {
      fileName: file.fileName,
      data: data,
    };
  });
  return result;
};

/**
 *
 * @param results
 * @returns
 */
const plasmidOnFilter = (
  results: ProcessedFileData[]
): ProcessedFileData[] | any[] => {
  let result: ProcessedFileData[] = results.map((file) => {
    let data: Bacteria[] = file.data.filter((bacteria) => {
      return bacteria.subjectGroup === 'PLASMID';
    });

    return {
      fileName: file.fileName,
      data: data,
    };
  });
  return result;
};

/**
 *
 * @param results
 * @returns
 */
const hostOnFilter = (
  results: ProcessedFileData[]
): ProcessedFileData[] | any[] => {
  let result: ProcessedFileData[] = results.map((file) => {
    let data: Bacteria[] = file.data.filter((bacteria) => {
      return bacteria.subjectGroup === 'HOST';
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
): Promise<ProcessedFileData[]> => {
  if (filters.topHits == 'All') return Promise.resolve(results);

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

  return Promise.resolve(results);
};

/**
 * Reformats the processed data so bacteria name is id.
 * Necessary for swapping axis on heatmap.
 * Also fills in blank spots on heatmap.
 * @param bacteriaSet
 * @param processedFileDataArr
 * @returns
 */
export const reformatData = (
  bacteriaSet: Set<Bacteria>,
  fullResults: ProcessedFileData[]
): Promise<ReformatedData[]> => {
  let reformatedDataArray: ReformatedData[] = [];

  bacteriaSet.forEach((bacteria) => {
    let dataArr: FileWithBacteriaAmount[] = fillInGaps(bacteria, fullResults);

    //create final obj
    let reformedDataElement: ReformatedData = {
      bacteria: bacteria.name,
      data: dataArr,
    };

    //add to array
    reformatedDataArray.push(reformedDataElement);
  });

  return Promise.resolve(reformatedDataArray);
};

/**
 * Helper function that checks if file has hits for other bacteria outside top x
 * @param bacteria
 * @param fullResults
 * @returns
 */
const fillInGaps = (
  bacteria: Bacteria,
  fullResults: ProcessedFileData[]
): FileWithBacteriaAmount[] => {
  // const result: FileWithBacteriaAmount;
  let dataArr: FileWithBacteriaAmount[] = [];

  fullResults.forEach((fileData) => {
    // get the full array of data for each file
    let bacteriaArray: Bacteria[] = fileData.data;

    // get the bacteria data that matches the id from the set element
    let fileBacteriaObj: Bacteria | undefined = bacteriaArray.find(
      (element) => element.taxId == bacteria.taxId
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

  return dataArr;
};

/**
 * Separates data into their individual subject groups
 */
export const groupData = async (
  results: ProcessedFileData[],
  spikes: Spikes[],
  filters: FilterData
): Promise<GroupedReformatedData[]> => {
  const result: GroupedReformatedData[] = [];

  let allGroup = await groupDataHelper(results, results, filters, 'ALL');
  result.push(allGroup);

  let spike: ProcessedFileData[] = spikesOnFilter(spikes, results);
  let spikeGroup = await groupDataHelper(results, spike, filters, 'SPIKES');
  result.push(spikeGroup);

  let host: ProcessedFileData[] = hostOnFilter(results);
  let hostGroup = await groupDataHelper(results, host, filters, 'HOST');
  result.push(hostGroup);

  let bacteria: ProcessedFileData[] = bacteriaOnFilter(results);
  let bacteriaGroup = await groupDataHelper(
    results,
    bacteria,
    filters,
    'BACTERIA'
  );
  result.push(bacteriaGroup);

  let plasmid: ProcessedFileData[] = plasmidOnFilter(results);
  let plasmidGroup = await groupDataHelper(
    results,
    plasmid,
    filters,
    'PLASMID'
  );
  result.push(plasmidGroup);

  let virus: ProcessedFileData[] = virusOnFilter(results);
  let virusGroup = await groupDataHelper(results, virus, filters, 'VIRUS');
  result.push(virusGroup);

  return result;
};

/**
 * Helper function to reduce code repetition
 * @param fullResults
 * @param groupResults
 * @param filters
 * @param subjectGroup
 * @returns
 */
const groupDataHelper = async (
  fullResults: ProcessedFileData[],
  groupResults: ProcessedFileData[],
  filters: FilterData,
  subjectGroup: string
): Promise<GroupedReformatedData> => {
  let groupDataFiltered = await topHitsFilter(filters, groupResults);
  let groupFormatted = await format(fullResults, groupDataFiltered);
  let result: GroupedReformatedData = {
    group: subjectGroup,
    data: groupFormatted,
  };

  return result;
};

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
