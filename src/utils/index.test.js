import '@testing-library/jest-dom';
import {
  filterResults,
  processEachFileMultipleSpikes,
  reformatData,
  filterFullResults,
  filterGroupData,
} from './index';

describe('utils methods', () => {
  const bacteriaArray = [
    {
      name: 'bacteria1',
      taxId: '1',
      recoveredAmount: 1,
      estimatedTotalAmount: 1,
      subjectLength: 1,
    },
    {
      name: 'bacteria2',
      taxId: '2',
      recoveredAmount: 2,
      estimatedTotalAmount: 2,
      subjectLength: 2,
    },
    {
      name: 'bacteria3',
      taxId: '3',
      recoveredAmount: 3,
      estimatedTotalAmount: 3,
      subjectLength: 3,
    },
    {
      name: 'bacteria4',
      taxId: '4',
      recoveredAmount: 4,
      estimatedTotalAmount: 4,
      subjectLength: 4,
    },
    {
      name: 'bacteria5',
      taxId: '5',
      recoveredAmount: 5,
      estimatedTotalAmount: 5,
      subjectLength: 5,
    },
    {
      name: 'bacteria6',
      taxId: '6',
      recoveredAmount: 6,
      estimatedTotalAmount: 6,
      subjectLength: 6,
    },
  ];

  const processedFileDataArray = [
    { fileName: 'file1', data: bacteriaArray },
    { fileName: 'file2', data: bacteriaArray },
    { fileName: 'file3', data: bacteriaArray },
  ];

  const spikes = [
    {
      fileName: '',
      taxId: '1',
      cellsPerMl: 1,
      genomeSize: 1,
    },
  ];

  test('check filterGroupData', async () => {
    let filter = {
      spikesOn: true,
      bacteriaOn: true,
      virusOn: true,
      plasmidOn: true,
      hostOn: true,
      archaeaOn: true,
      protozoaOn: true,
      fungiOn: true,
      topHits: '10',
      minHitThreshold: 4,
      scaleOpt: 'logarithmic',
    };

    let results = await filterGroupData(processedFileDataArray, filter, 'ALL');

    //Should filter out bacteria with estimatedTotalAmount lower than minHitThreshold
    expect(results.data.length === 3);

    filter.topHits = '2';
    let results2 = await filterGroupData(processedFileDataArray, filter, 'ALL');

    //Should leave only the top 2 highest scoring bacteria
    expect(results.data.length === 2);
  });

  test('check data reformatting', async () => {
    let bacteriaSet = new Set(bacteriaArray);

    return reformatData(bacteriaSet, processedFileDataArray).then((data) => {
      expect.arrayContaining([
        expect.objectContaining({
          bacteria: 'bacteria1',
          data: [
            {
              fileName: 'file1',
              amount: 1,
            },
            {
              fileName: 'file2',
              amount: 1,
            },
            {
              fileName: 'file3',
              amount: 1,
            },
          ],
        }),
      ]);
    });
  });

  test('test individual file processing returns correct data', () => {
    const spike = {
      fileName: 'spike bacteria',
      taxId: '1',
      cellsPerMl: 5,
      genomeSize: 5,
    };

    const spikeRecord = {
      queryLen: 1,
      queryStart: 1,
      queryEnd: 2,
      subjectStart: 1,
      subjectEnd: 2,
      alignmentLen: 1,
      pIdent: 1,
      eVal: 1,
      mismatches: 1,
      rawScore: 1,
      subjectLen: 5,
      taxId: '1',
      accId: '1',
      subjectTitle: 'spike bacteria',
      accIdVersion: 'spike bacteria',
      fbtop: 'dummy bacteria',
    };

    const fileRecord = {
      queryLen: 1,
      queryStart: 1,
      queryEnd: 2,
      subjectStart: 1,
      subjectEnd: 2,
      alignmentLen: 1,
      pIdent: 1,
      eVal: 1,
      mismatches: 1,
      rawScore: 1,
      subjectLen: 5,
      taxId: '2',
      accId: '2',
      subjectTitle: 'dummy bacteria',
      accIdVersion: 'dummy bacteria',
      fbtop: 'dummy bacteria',
    };

    const fileRecordArray = [spikeRecord, fileRecord, fileRecord, fileRecord];

    const result = processEachFileMultipleSpikes([spike], fileRecordArray);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'dummy bacteria',
          taxId: '2',
          subjectLength: 5,
          recoveredAmount: 3,
          estimatedTotalAmount: 15,
        }),

        expect.objectContaining({
          name: 'spike bacteria',
          taxId: '1',
          subjectLength: 5,
          recoveredAmount: 1,
          estimatedTotalAmount: 5,
        }),
      ])
    );
  });
});
