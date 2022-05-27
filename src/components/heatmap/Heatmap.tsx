import React, { useEffect, useState } from 'react';
import {
  SequentialLegend,
  Heatmap as ReavizHeatmap,
  HeatmapSeries,
} from 'reaviz';

interface DataObj {
  key: string;
  data: number;
}

interface HeatmapData {
  key: string;
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
        key: bac.name,
        data: bac.estimatedTotalAmount,
      };
    });
    return {
      key: file.fileName,
      data: dataArr,
    };
  });

  return heatmapData;
};

const Heatmap: React.FC<Props> = (props) => {
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
        <div className="text-center row m-auto chart-background">
          <ReavizHeatmap
            height={400}
            width={400}
            data={data}
            style={{}}
            series={<HeatmapSeries padding={0.05} animated={true} />}
            data-testid={'heatmap'}
          />
          <SequentialLegend
            data={data}
            style={{ height: '350px', marginLeft: '10px' }}
          />
        </div>
      )}
    </>
  );
};

export default Heatmap;
