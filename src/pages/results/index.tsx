import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Loader from "../../components/loader/Loader";
import { RootState } from "../../redux/store";

const Results = () => {
  const [loading, setLoading] = useState(true);

  const records = useSelector((state: RootState) => state.records.data);
  const spikeData = useSelector((state: RootState) => state.spikeData.data);

  console.log(records);
  // console.log(spikeData);



  return (
    <section className="background">
      <div className="light-overlay">
        <Container className="">
          <div className="text-center row">
            <h1 className="my-4 main-color">Results</h1>

            {loading && <Loader />}
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Results;
