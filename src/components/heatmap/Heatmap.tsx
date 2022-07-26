import React, { useEffect, useState } from 'react';
import { HeatMapCanvas, ResponsiveHeatMapCanvas } from '@nivo/heatmap';
import { group } from 'console';

interface DataObj {
  x: string;
  y: number;
}

interface HeatmapData {
  id: string;
  data: DataObj[];
}

type Props = {
  group: string;
  results: ReformatedData[] | any;
  setLoading: (arg: boolean) => void;
  color: string;
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
  const { results, setLoading, color, group } = props;
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
            <HeatMapCanvas
              data={data}
              // forceSquare
              margin={{ top: 70, right: 90, bottom: 20, left: 300 }}
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
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: 40,
                format: (value) => {
                  return value.length > 40 ? value.slice(0, 40) + '...' : value;
                },
              }}
              axisRight={null}
              colors={{
                type: 'diverging',
                scheme: color,
              }}
              emptyColor="#555555"
              borderWidth={1}
              borderColor="#000000"
              enableLabels={false}
              legends={[
                {
                  anchor: 'top-right',
                  translateX: 40,
                  translateY: 0,
                  length: 700,
                  thickness: 16,
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
              height={800}
              width={1000}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Heatmap;
