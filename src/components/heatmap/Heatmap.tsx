import React, { useEffect, useState } from 'react';
import { Heatmap as ReavizHeatmap } from 'reaviz';
import PropTypes from 'prop-types';

interface DataObj {
  key: string;
  data: number;
}

interface HeatmapData {
  key: string;
  data: DataObj[];
}

type Props = {
  results: ProcessedFileData[];
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

  console.log(heatmapData);
  return heatmapData;
};

const Heatmap: React.FC<Props> = (props) => {
  const { results, setLoading } = props;
  const [data, setData] = useState<HeatmapData[]>();

  useEffect(() => {
    setData(mapToHeatmapData(results));

    if (data) setLoading(false);
  }, [results]);

  // let data: HeatmapData[] = mapToHeatmapData(results);

  return (
    <div style={{ margin: '55px', textAlign: 'center' }}>
      {data && <ReavizHeatmap height={350} width={350} data={data} />}
    </div>
  );
};

export default Heatmap;
