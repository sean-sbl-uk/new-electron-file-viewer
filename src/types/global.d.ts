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


  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: any, args: unknown[] | any): void;
        on(
          channel: string,
          func: (...args: unknown[] | any) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;

        sendSync(channel: any, args: unknown[] | any): void
      };
    };
  }

