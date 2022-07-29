import { FileWithPath } from 'react-dropzone';

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
        estimatedTotalAmountLog10: 0,
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

  bacteriaArray.forEach((bacteria) => {
    bacteria.estimatedTotalAmount =
      (bacteria.recoveredAmount * recoveryRatio) / bacteria.subjectLength;
    bacteria.estimatedTotalAmountLog10 = Math.log10(
      (bacteria.recoveredAmount * recoveryRatio) / bacteria.subjectLength
    );
  });

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
export const filterFullResults = async (
  results: ProcessedFileData[],
  filters: FilterData
): Promise<ProcessedFileData[]> => {
  //Checkboxes
  results = filters.bacteriaOn
    ? results
    : await groupOffFilter(results, 'BACTERIA');
  results = filters.spikesOn ? results : await groupOffFilter(results, 'SPIKE');
  results = filters.virusOn ? results : await groupOffFilter(results, 'VIRUS');
  results = filters.plasmidOn
    ? results
    : await groupOffFilter(results, 'PLASMID');
  results = filters.hostOn ? results : await groupOffFilter(results, 'HOST');
  results = filters.archaeaOn
    ? results
    : await groupOffFilter(results, 'ARCHAEA');
  results = filters.fungiOn ? results : await groupOffFilter(results, 'FUNGI');
  results = filters.protozoaOn
    ? results
    : await groupOffFilter(results, 'PROTOZOA');

  return Promise.resolve(results);
};

/**
 * Filters out subject group
 * @param results
 * @param group
 * @returns
 */
const groupOffFilter = async (
  results: ProcessedFileData[],
  group: string
): Promise<any[] | ProcessedFileData[]> => {
  let result: ProcessedFileData[] = results.map((file) => {
    let data: Bacteria[] = file.data.filter((bacteria) => {
      return bacteria.subjectGroup !== group;
    });

    return {
      fileName: file.fileName,
      data: data,
    };
  });
  return Promise.resolve(result);
};

/**
 * Filters out everything except subject group
 * @param results
 * @param group
 * @returns
 */
const groupOnFilter = async (
  results: ProcessedFileData[],
  group: string
): Promise<any[] | ProcessedFileData[]> => {
  let result: ProcessedFileData[] = results.map((file) => {
    let data: Bacteria[] = file.data.filter((bacteria) => {
      return bacteria.subjectGroup === group;
    });

    return {
      fileName: file.fileName,
      data: data,
    };
  });
  return Promise.resolve(result);
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
  if (filters.topHits == 'All') {

    return Promise.resolve(results);
  }

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

  //REMOVE
  console.log(filters.topHits);
  console.log(results);
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
  fullResults: ProcessedFileData[],
  scaleOpt: string
): Promise<ReformatedData[]> => {
  let reformatedDataArray: ReformatedData[] = [];

  bacteriaSet.forEach((bacteria) => {
    let dataArr: FileWithBacteriaAmount[] = fillInGaps(
      bacteria,
      fullResults,
      scaleOpt
    );

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
  fullResults: ProcessedFileData[],
  scaleOptions: string
): FileWithBacteriaAmount[] => {
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
            amount:
              scaleOptions === 'linear'
                ? fileBacteriaObj.estimatedTotalAmount
                : fileBacteriaObj.estimatedTotalAmountLog10,
          };

    dataArr.push(fileWithBacteriaAmount);
  });

  return dataArr;
};

/**
 * Separates data into their individual subject groups
 */
//TODO groupDataArray
export const getGroupedDataArray = async (
  results: ProcessedFileData[],
  filters: FilterData
): Promise<GroupedReformatedData[]> => {
  const result: GroupedReformatedData[] = [];

  let allGroup = await filterGroupData(results, filters, 'ALL');

  result.push(allGroup);

  let bacteriaGroup = await filterGroupData(results, filters, 'BACTERIA');
  result.push(bacteriaGroup);

  let plasmidGroup = await filterGroupData(results, filters, 'PLASMID');
  result.push(plasmidGroup);

  let virusGroup = await filterGroupData(results, filters, 'VIRUS');
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
export const filterGroupData = async (
  fullResults: ProcessedFileData[],
  filters: FilterData,
  subjectGroup: string
): Promise<GroupedReformatedData> => {
  let groupResults: ProcessedFileData[] =
    subjectGroup === 'ALL'
      ? await filterFullResults(fullResults, filters)
      : await groupOnFilter(fullResults, subjectGroup);

  groupResults = await minHitThreshold(filters, groupResults);

  let groupDataFiltered = await topHitsFilter(filters, groupResults);

  let scaleOpt: string = filters.scaleOpt;
  let groupFormatted = await format(fullResults, groupDataFiltered, scaleOpt);

  let result: GroupedReformatedData = {
    group: subjectGroup,
    data: groupFormatted,
  };

  return result;
};

export const format = async (
  fullResults: ProcessedFileData[],
  filtered: ProcessedFileData[],
  scaleOpt: string

): Promise<ReformatedData[]> => {
  let bacteriaSet: Set<Bacteria> = new Set();

  filtered.forEach((file) => {
    file.data.forEach((bacteria) => {
      bacteriaSet.add(bacteria);
    });
  });

  let reformatedDataArray: ReformatedData[] = await reformatData(
    bacteriaSet,
    fullResults,
    scaleOpt
  );

  return reformatedDataArray;
};

/**
 * Filters out reads that don't meet the min hit threshold
 * @param filters
 * @param groupData
 */
const minHitThreshold = async (
  filters: FilterData,
  groupData: ProcessedFileData[]
): Promise<ProcessedFileData[]> => {
  let result: ProcessedFileData[] = groupData.map((file) => {
    let data: Bacteria[] = file.data.filter((bacteria) => {
      return bacteria.estimatedTotalAmount >= filters.minHitThreshold;
    });

    return {
      fileName: file.fileName,
      data: data,
    };
  });
  return Promise.resolve(result);
};
