import React, { useEffect, useState } from 'react';
import { ResponsiveHeatMapCanvas, HeatMapCanvas } from '@nivo/heatmap';

interface DataObj {
  x: string;
  y: number;
}

interface HeatmapData {
  id: string;
  data: DataObj[];
}

type Props = {
  results: ReformatedData[] | any;
  setLoading: (arg: boolean) => void;
};

const mapToHeatmapData = (results: ReformatedData[]): HeatmapData[] => {
  let heatmapData: HeatmapData[] = [];

  heatmapData = results.map((bacteria) => {
    let dataArr: DataObj[] = bacteria.data.map((file) => {
      return {
        x: file.fileName,
        y: file.amount,
      };
    });

    return {
      id: bacteria.bacteria,
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

  return (
    <>
      {data && (
        <>
          <div
            className="text-center row m-auto chart-background"
            data-testid="heatmap"
          >
            {/* <ResponsiveHeatMapCanvas */}
            <HeatMapCanvas
              data={data}
              forceSquare
              margin={{ top: 70, right: 60, bottom: 20, left: 80 }}
              valueFormat=">-.2s"
              axisTop={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: '',
                legendOffset: 46,
                format: (value) => {
                  return value.length > 7 ? value.slice(0, 7) : value;
                },
              }}
              axisBottom={null}
              // axisBottom={{
              //   tickSize: 5,
              //   tickPadding: 5,
              //   tickRotation: -45,
              //   legend: '',
              //   legendOffset: 46,
              //   format: (value) => {
              //     return value.length > 7 ? value.slice(0, 7) : value;
              //   },
              // }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: 40,
                format: (value) => {
                  return value.length > 16 ? value.slice(0, 20) + '...' : value;
                },
              }}
              axisRight={null}
              colors={{
                type: 'diverging',
                scheme: 'blues',
                // steps: 16,
                minValue: 0,
                maxValue: 100000,
              }}
              emptyColor="#555555"
              borderWidth={1}
              borderColor="#000000"
              enableLabels={false}
              legends={[
                {
                  anchor: 'top-right',
                  translateX: 20,
                  translateY: 0,
                  length: 200,
                  thickness: 10,
                  direction: 'column',
                  tickPosition: 'after',
                  tickSize: 3,
                  tickSpacing: 4,
                  tickOverlap: false,
                  tickFormat: '>-.2s',
                  title: '',
                  titleAlign: 'start',
                  titleOffset: 4,
                },
              ]}
              annotations={[]}
              height={720}
              width={696}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Heatmap;
