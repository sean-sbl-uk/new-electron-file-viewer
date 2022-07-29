import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import store, { RootState } from '../../redux/store';
import { filterGroupData } from '../../utils';
import Heatmap from '../heatmap/Heatmap';
import Filters from '../filters/Filters';

const dropdownStyle = {
  width: '100%',
};

type Props = {
  groupedData: GroupedReformatedData;
  setLoading: (arg: boolean) => void;
};

const defaultFilterData: FilterData = {
  spikesOn: true,
  bacteriaOn: true,
  virusOn: true,
  plasmidOn: true,
  hostOn: true,
  archaeaOn: true,
  fungiOn: true,
  protozoaOn: true,
  topHits: '10',
  minHitThreshold: 1,
  scaleOpt: 'logarithmic',
};

const ResultsCard: React.FC<Props> = (props) => {
  const [color, setColor] = useState<string>('green_blue');

  const [dataVisualization, setDataVisualization] = useState<string>('heatmap');
  const [showFiltering, setShowFiltering] = useState(false);
  const [data, setData] = useState<ReformatedData[]>([]);
  const [filterData, setFilterData] = useState<FilterData>(defaultFilterData);

  const { groupedData, setLoading } = props;
  const group: string = groupedData.group;
  // const data: ReformatedData[] = groupedData.data;

  const state = store.getState();

  useEffect(() => {
    setData(groupedData.data);
  }, []);

  const handleDropdownSelect = (e: any) => {
    setDataVisualization(e);
  };

  const handleColorDropdown = (e: any) => {
    setColor(e);
  };

  const handleOpenFiltering = () => {
    setShowFiltering(true);
  };

  const handleCloseFiltering = () => {
    setShowFiltering(false);
  };

  const handleFilterSubmit = async (filters: FilterData) => {
    // setLoading(true);
    setShowFiltering(false);

    const fullResults: ProcessedFileData[] = state?.results?.data;
    // const spikes: Spikes[] = state?.spikeData?.data;

    if (fullResults) {
      let results = await filterGroupData(fullResults, filters, group);
      setData(results.data);
      setFilterData(filters);
    }
  };

  const buttons = (
    <div className="mt-5">
      <Row
        xs={1}
        md={6}
        lg={8}
        className="justify-content-start align-items-center"
      >
        <Col>
          <Button
            className="mr-1 btn-block"
            variant="secondary"
            onClick={handleOpenFiltering}
            style={{ width: '100%' }}
          >
            Filtering
          </Button>{' '}
        </Col>

        <Col>
          <DropdownButton
            className="btn-block dropdown"
            data-testid="result-dropdown"
            title="Data Visulazation"
            onSelect={handleDropdownSelect}
            variant="secondary"
            style={dropdownStyle}
          >
            <Dropdown.Item eventKey="heatmap">Heatmap</Dropdown.Item>
            <Dropdown.Item disabled>Future Chart Opts...</Dropdown.Item>
          </DropdownButton>
        </Col>

        <Row>
          <DropdownButton
            className="btn-block dropdown"
            data-testid="color-dropdown"
            title="Color"
            onSelect={handleColorDropdown}
            variant="secondary"
            style={dropdownStyle}
          >
            <Dropdown.Item eventKey="blues">Blue</Dropdown.Item>
            <Dropdown.Item eventKey="reds">Red</Dropdown.Item>
            <Dropdown.Item eventKey="greens">Green</Dropdown.Item>
            <Dropdown.Item eventKey="blue_purple">Blue/Purple</Dropdown.Item>
            <Dropdown.Item eventKey="purpleRed_green">
              Purple/Green
            </Dropdown.Item>
            <Dropdown.Item eventKey="yellow_orange_red">
              Yellow/Red
            </Dropdown.Item>
            <Dropdown.Item eventKey="red_blue">Red/Blue</Dropdown.Item>
            <Dropdown.Item eventKey="green_blue">Green/Blue</Dropdown.Item>
            <Dropdown.Item eventKey="red_yellow_blue">
              Red/Yellow/Blue
            </Dropdown.Item>
            <Dropdown.Item eventKey="warm">Warm</Dropdown.Item>
            <Dropdown.Item eventKey="plasma">Plasma</Dropdown.Item>
            <Dropdown.Item eventKey="spectral">Spectral</Dropdown.Item>
            <Dropdown.Item eventKey="rainbow">Rainbow</Dropdown.Item>
          </DropdownButton>
        </Row>
        <Col>
          <h2 className="main-color page-title">{group}</h2>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="mb-5">
      {buttons}
      <Heatmap
        group={group}
        color={color}
        setLoading={setLoading}
        results={data}
      />
      <Filters
        group={group}
        show={showFiltering}
        handleCloseFiltering={handleCloseFiltering}
        handleFilterSubmit={handleFilterSubmit}
        filterData={filterData}
      />
    </div>
  );
};

export default ResultsCard;
