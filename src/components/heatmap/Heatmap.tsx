import React, { useEffect, useState } from 'react';
import {
  SequentialLegend,
  Heatmap as ReavizHeatmap,
  HeatmapSeries,
} from 'reaviz';

// import { ResponsiveHeatMapCanvas } from '@nivo/heatmap';

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

  useEffect(() => {
    setData(mapToHeatmapData(results));

    setLoading(false);
  }, [results]);

  // let data: HeatmapData[] = mapToHeatmapData(results);

  // const color = select()

  return (
    <>
      {data && (
        <>
          <div
            style={{ display: 'flex' }}
            className="text-center row m-auto chart-background"
            data-testid="heatmap"
          >
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

            {/* <ResponsiveHeatMapCanvas
              data={data}
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
            /> */}
          </div>
        </>
      )}
    </>
  );
};

export default Heatmap;
