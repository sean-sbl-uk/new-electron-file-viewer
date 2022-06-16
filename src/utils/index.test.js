import '@testing-library/jest-dom';
import { filterResults, reformatData } from './index';

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

  test('test filtering top hits', async () => {
    const filters = {
      spikesOn: true,
      topHits: '3',
      minHitThreshold: 1,
    };

    const spikeBacteria = {
      name: 'bacteria6',
      taxId: '6',
      recoveredAmount: 6,
      estimatedTotalAmount: 6,
      subjectLength: 6,
    };

    return filterResults(processedFileDataArray, spikes, filters).then(
      (data) => {
        data.forEach((file) => {
          //tests the top hits
          expect(file.data.length).toBe(3);

          //checks spike is in result
          expect(file.data).toEqual(
            expect.arrayContaining([expect.objectContaining(spikeBacteria)])
          );
        });
      }
    );
  });

  test('test filtering out spikes', async () => {
    const spikesOffFilter = {
      spikesOn: false,
      topHits: '3',
      minHitThreshold: 1,
    };

    const spikeBacteria = {
      name: 'bacteria1',
      taxId: '1',
      recoveredAmount: 1,
      estimatedTotalAmount: 1,
      subjectLength: 1,
    };

    return filterResults(processedFileDataArray, spikes, spikesOffFilter).then(
      (data) => {
        data.forEach((file) => {
          expect(file.data).not.toContain(spikeBacteria);
        });
      }
    );
  });
});