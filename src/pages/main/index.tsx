import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from 'react-bootstrap';
import Container from '../../components/container/Container';
import Dropzone from '../../components/dropzone/Dropzone';
import Modal from '../../components/spikeModal/SpikeModal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { FileWithPath } from 'react-dropzone';
import FadeIn from 'react-fade-in';
import { setReduxStoreFiles } from '../../redux/files';
import Layout from '../../layouts/Layout';

const Main = () => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [spikesSet, setSpikesSet] = useState(false);

  const spikeData = useSelector((state: RootState) => state.spikeData.data);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(spikeData).length !== 0) {
      setSpikesSet(true);
    } else {
      setSpikesSet(false);
    }
  }, [spikeData]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const analyseOnClick = async () => {
    //convert file objs to serializable to dispatch
    let fileArray: any[] = Array.from(files).map((file) => {
      return {
        lastModified: file.lastModified,
        name: file.name,
        path: file.path,
        size: file.size,
        type: file.type,
      };
    });

    await dispatch(setReduxStoreFiles(fileArray));
    navigate('/results', { replace: true });
  };

  const analyseButton = spikesSet ? (
    <Button variant="outline-secondary" onClick={analyseOnClick}>
      Analyse
    </Button>
  ) : (
    <Button variant="outline-secondary" onClick={analyseOnClick} disabled>
      Analyse
    </Button>
  );

  const spikesButton =
    files.length === 0 ? (
      <Button variant="secondary" onClick={handleOpenModal} disabled>
        Set Spikes
      </Button>
    ) : (
      <Button variant="secondary" onClick={handleOpenModal}>
        Set Spikes
      </Button>
    );

  const content = (
    <div className="text-center row " style={{ width: '100%' }}>
      <FadeIn>
        <Dropzone setFiles={setFiles}>
          <Stack gap={2}>
            {spikesButton}
            {analyseButton}
          </Stack>
        </Dropzone>
      </FadeIn>
      <Modal
        show={showModal}
        handleCloseModal={handleCloseModal}
        files={files}
      />
    </div>
  );

  return <Layout title="File Upload">{content}</Layout>;
};

export default Main;
