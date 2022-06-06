import React, { useEffect, useState } from 'react';
// import {
//   SequentialLegend,
//   Heatmap as ReavizHeatmap,
//   HeatmapSeries,
// } from 'reaviz';

import { ResponsiveHeatMapCanvas } from '@nivo/heatmap';

interface DataObj {
  x: string;
  y: number;
}

interface HeatmapData {
  id: string;
  data: DataObj[];
}

type Props = {
  results: ProcessedFileData[] | any;
  setLoading: (arg: boolean) => void;
};

const mapToHeatmapData = (results: ProcessedFileData[]): HeatmapData[] => {
  let heatmapData: HeatmapData[] = [];

  heatmapData = results.map((file) => {
    let dataArr: DataObj[] = file.data.map((bac) => {
      return {
        // key: bac.name,
        // data: bac.estimatedTotalAmount,
        x: bac.name,
        y: bac.estimatedTotalAmount,
      };
    });
    return {
      // key: file.fileName,
      // data: dataArr,
      id: file.fileName,
      data: dataArr,
    };
  });

  return heatmapData;
};

const Heatmap: React.FC<Props> = (props: any) => {
  const { results, setLoading } = props;
  const [data, setData] = useState<HeatmapData[]>();

  console.log(results);

  useEffect(() => {
    setData(mapToHeatmapData(results));

    setLoading(false);
  }, [results]);

  // let data: HeatmapData[] = mapToHeatmapData(results);

  const dummyData = [
    {
      id: 'Japan',
      data: [
        {
          x: 'Train',
          y: -54909,
        },
        {
          x: 'Subway',
          y: -91701,
        },
        {
          x: 'Bus',
          y: 95240,
        },
        {
          x: 'Car',
          y: -23960,
        },
        {
          x: 'Boat',
          y: -47536,
        },
        {
          x: 'Moto',
          y: 63232,
        },
        {
          x: 'Moped',
          y: 28928,
        },
        {
          x: 'Bicycle',
          y: 14710,
        },
        {
          x: 'Others',
          y: -75176,
        },
      ],
    },
    {
      id: 'France',
      data: [
        {
          x: 'Train',
          y: -47256,
        },
        {
          x: 'Subway',
          y: -91061,
        },
        {
          x: 'Bus',
          y: -1628,
        },
        {
          x: 'Car',
          y: 98125,
        },
        {
          x: 'Boat',
          y: 25440,
        },
        {
          x: 'Moto',
          y: 99739,
        },
        {
          x: 'Moped',
          y: 23499,
        },
        {
          x: 'Bicycle',
          y: 42829,
        },
        {
          x: 'Others',
          y: 99106,
        },
      ],
    },
    {
      id: 'US',
      data: [
        {
          x: 'Train',
          y: 76643,
        },
        {
          x: 'Subway',
          y: -12472,
        },
        {
          x: 'Bus',
          y: 98047,
        },
        {
          x: 'Car',
          y: -59360,
        },
        {
          x: 'Boat',
          y: 53235,
        },
        {
          x: 'Moto',
          y: -61081,
        },
        {
          x: 'Moped',
          y: 89386,
        },
        {
          x: 'Bicycle',
          y: -76237,
        },
        {
          x: 'Others',
          y: -94960,
        },
      ],
    },
    {
      id: 'Germany',
      data: [
        {
          x: 'Train',
          y: -18346,
        },
        {
          x: 'Subway',
          y: 43413,
        },
        {
          x: 'Bus',
          y: 40632,
        },
        {
          x: 'Car',
          y: -37990,
        },
        {
          x: 'Boat',
          y: 622,
        },
        {
          x: 'Moto',
          y: -77538,
        },
        {
          x: 'Moped',
          y: -32081,
        },
        {
          x: 'Bicycle',
          y: 47803,
        },
        {
          x: 'Others',
          y: -13734,
        },
      ],
    },
    {
      id: 'Norway',
      data: [
        {
          x: 'Train',
          y: -54779,
        },
        {
          x: 'Subway',
          y: -14590,
        },
        {
          x: 'Bus',
          y: -11443,
        },
        {
          x: 'Car',
          y: 90096,
        },
        {
          x: 'Boat',
          y: -10387,
        },
        {
          x: 'Moto',
          y: -88002,
        },
        {
          x: 'Moped',
          y: 8237,
        },
        {
          x: 'Bicycle',
          y: 24890,
        },
        {
          x: 'Others',
          y: -25609,
        },
      ],
    },
    {
      id: 'Iceland',
      data: [
        {
          x: 'Train',
          y: -39152,
        },
        {
          x: 'Subway',
          y: -37668,
        },
        {
          x: 'Bus',
          y: -88243,
        },
        {
          x: 'Car',
          y: -68087,
        },
        {
          x: 'Boat',
          y: 71222,
        },
        {
          x: 'Moto',
          y: 34266,
        },
        {
          x: 'Moped',
          y: 45172,
        },
        {
          x: 'Bicycle',
          y: -68706,
        },
        {
          x: 'Others',
          y: 55636,
        },
      ],
    },
    {
      id: 'UK',
      data: [
        {
          x: 'Train',
          y: 74830,
        },
        {
          x: 'Subway',
          y: 18242,
        },
        {
          x: 'Bus',
          y: 6698,
        },
        {
          x: 'Car',
          y: 44550,
        },
        {
          x: 'Boat',
          y: -19182,
        },
        {
          x: 'Moto',
          y: 61019,
        },
        {
          x: 'Moped',
          y: 50238,
        },
        {
          x: 'Bicycle',
          y: 42752,
        },
        {
          x: 'Others',
          y: 63526,
        },
      ],
    },
    {
      id: 'Vietnam',
      data: [
        {
          x: 'Train',
          y: -36936,
        },
        {
          x: 'Subway',
          y: 14949,
        },
        {
          x: 'Bus',
          y: 52225,
        },
        {
          x: 'Car',
          y: 68263,
        },
        {
          x: 'Boat',
          y: 41426,
        },
        {
          x: 'Moto',
          y: 90232,
        },
        {
          x: 'Moped',
          y: -40426,
        },
        {
          x: 'Bicycle',
          y: -68041,
        },
        {
          x: 'Others',
          y: 24872,
        },
      ],
    },
  ];

  return (
    <>
      {data && (
        <>
          {/* <div
            className="text-center row m-auto chart-background"
            data-testid="heatmap"
          > */}
          {/* <ReavizHeatmap
              height={400}
              // width={500}
              data={data}
              style={{}}
              series={<HeatmapSeries padding={0.05} animated={true} />}
              data-testid={'heatmap'}
            />
            <SequentialLegend
              data={data}
              style={{ height: '350px', marginLeft: '10px' }}
            /> */}

          <ResponsiveHeatMapCanvas
            data={data}
            // data={dummyData}
            forceSquare
            margin={{ top: 70, right: 60, bottom: 20, left: 80 }}
            valueFormat=">-.2s"
            axisTop={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -90,
              legend: '',
              legendOffset: 46,
            }}
            axisRight={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'country',
              legendPosition: 'middle',
              legendOffset: 40,
            }}
            axisLeft={null}
            colors={{
              type: 'quantize',
              scheme: 'red_yellow_blue',
              steps: 10,
              minValue: -100000,
              maxValue: 100000,
            }}
            emptyColor="#555555"
            borderWidth={1}
            borderColor="#000000"
            enableLabels={false}
            legends={[
              {
                anchor: 'left',
                translateX: -50,
                translateY: 0,
                length: 200,
                thickness: 10,
                direction: 'column',
                tickPosition: 'after',
                tickSize: 3,
                tickSpacing: 4,
                tickOverlap: false,
                tickFormat: '>-.2s',
                title: 'Value →',
                titleAlign: 'start',
                titleOffset: 4,
              },
            ]}
            annotations={[]}
          />
          {/* </div> */}
        </>
      )}
    </>
  );
};

export default Heatmap;
