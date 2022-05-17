import { FileWithPath } from "react-dropzone";

const ipcRenderer = window.electron.ipcRenderer;

export const readCSVFile = (fileObject: FileWithPath): any => {

  const filePath = fileObject.path;

  return ipcRenderer.on('csv-file-read-reply', (args) => {
    console.log(args)
    return args;
  })

  ipcRenderer.sendMessage("csv-file-read", filePath);

};

//for each file
// export const processRawData = (spikeData : Object, records: Object[]) => {

//     let spikeDNAIn = 0;
//     let spikeDNAOut = 0;

//count up all records for given spike
// }
