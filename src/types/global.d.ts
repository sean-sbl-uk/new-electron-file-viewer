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
  subjectGroup: string;
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
  recoveredAmount: number;
  estimatedTotalAmount: number;
  subjectLength: number;
  subjectGroup: string;
};

declare type Spikes = {
  fileName: string;
  taxId: string;
  cellsPerMl: number;
  genomeSize: number;
};

declare type ProcessedFileData = {
  fileName: string;
  data: Bacteria[];
};

declare type ReformatedData = {
  bacteria: string;
  data: FileWithBacteriaAmount[];
};

//Use array of this to map each group to separate heatmap
declare type GroupedReformatedData = {
  group: string;
  data: ReformatedData[];
};

declare type FileWithBacteriaAmount = {
  fileName: string;
  amount: number;
};

declare type FilterData = {
  spikesOn: boolean;
  bacteriaOn: boolean;
  virusOn: boolean;
  plasmidOn: boolean;
  hostOn: boolean;
  archaeaOn: boolean;
  fungiOn: boolean;
  protozoaOn: boolean;
  topHits: string;
  minHitThreshold: number;
};

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
