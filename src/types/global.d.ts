declare type FileRecord = {
  queryLen: number;
  queryStart: number;
  queryEnd: number;
  subjectStart: number;
  subjectEnd: number;
  alignmentLen: number;
  pIdent: number;
  eVal: number;
  mismatches: number;
  rawScore: number;
  subjectLen: number;
  taxId: string;
  accId: string;
  subjectTitle: string;
  accIdVersion: string;
  fbtop: string;
};

declare type FileRecords = {
  fileName: string;
  records: FileRecord[];
};

declare type Bacteria = {
  name: string;
  taxId: string;
  recoverdAmount: number;
  estimatedTotalAmount: number;
};

declare type Spikes = {
  fileName: string;
  taxId: string;
  cellsPerMl: number;
  genomeSize: number;
};

declare type ProcessedFileData = {
  name: string;
  data: Bacteria[];
};

// interface Data {
//   fileName: string;
//   taxId: String;
//   cellsPerMl: number;
//   genomeSize: number;
// }

interface Window {
  electron: {
    ipcRenderer: {
      sendMessage(channel: any, args: unknown[] | any): void;
      on(
        channel: string,
        func: (...args: unknown[] | any) => void
      ): (() => void) | undefined;
      once(channel: string, func: (...args: unknown[]) => void): void;

      sendSync(channel: any, args: unknown[] | any): void;
    };
  };
}
