import { FileWithPath } from 'react-dropzone';

const ipcRenderer = window.electron.ipcRenderer;

// export const readCSVFile = (fileObject: FileWithPath): any => {

//   const filePath = fileObject.path;

//   let result;

//   ipcRenderer.on('csv-file-read-reply', (args) => {
//     console.log(args)

//     result = args;
//     // return args;
//   })

//   ipcRenderer.sendMessage("csv-file-read", filePath);

// };

export const processEachFile = (
  spikeData: Spikes,
  records: FileRecord[]
): Bacteria[] => {
  let bacteriaArray: Bacteria[] = [];

  let spikeTaxId: string = spikeData.taxId;
  let spikeDNAIn: number = spikeData.cellsPerMl * spikeData.genomeSize;
  let spikeDNAOut: number = 0;

  records.forEach((record) => {
    // count up all records for given spike
    if (record.taxId === spikeTaxId) {
      spikeDNAOut += record.queryLen;
    } else {
      //if not spike see if exists in bac array
      if (!bacteriaArray.some((bacteria) => bacteria.taxId === record.taxId)) {
        let newBacteria: Bacteria = {
          name: record.subjectTitle,
          taxId: record.taxId,
          recoverdAmount: record.queryLen,
          estimatedTotalAmount: 0,
        };
        bacteriaArray.push(newBacteria);
      } else {
        // count up all records for other species
        let bacteriaIndex = bacteriaArray.findIndex(
          (bacteria) => bacteria.taxId === record.taxId
        );
        bacteriaArray[bacteriaIndex].recoverdAmount += record.queryLen;
      }
    }
  });

  // calculate recovery ratio
  let recoveryRatio = (spikeDNAIn / spikeDNAOut) * 100;
  let multiplier = 1 / recoveryRatio;

  // use recovery ratio to estimate cells in other species
  bacteriaArray.forEach(
    (bacteria) =>
      (bacteria.estimatedTotalAmount = bacteria.recoverdAmount * multiplier)
  );

  return bacteriaArray;
};

export const processAllFiles = (
  allFileRecords: FileRecords[],
  allSpikeData: Spikes[]
): Promise<ProcessedFileData[]> => {
  const processedDataArray: ProcessedFileData[] = [];

  // for each file
  allFileRecords.forEach((file) => {
    // remove path to get file name
    let fileName: string = file.fileName.substring(
      file.fileName.lastIndexOf('/') + 1
    );

    //if spikes > 1 do below.
    let spikes =
      allSpikeData.length > 1
        ? allSpikeData.find((spike) => spike.fileName === fileName)
        : allSpikeData[0];
    // let spikes = allSpikeData.find((spike) => spike.fileName === fileName);

    //else spike is the same for each file, first in array

    let records = file.records;
    // if(allSpikeData.some(spike => spike.fileName === fileName)) {}

    if (spikes && records) {
      let data = processEachFile(spikes, records);

      const processedFileData: ProcessedFileData = {
        fileName: fileName,
        data: data,
      };

      processedDataArray.push(processedFileData);
    }
  });

  return Promise.resolve(processedDataArray);
};
