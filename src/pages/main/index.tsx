import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from 'react-bootstrap';
import Container from '../../components/container/Container';
import Dropzone from '../../components/dropzone/Dropzone';
import Modal from '../../components/modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setRecords } from '../../redux/records';
import { FileWithPath } from 'react-dropzone';
import { setReduxStoreFiles } from '../../redux/files';

const Main = () => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [spikesSet, setSpikesSet] = useState(false);

  const spikeData = useSelector((state: RootState) => state.spikeData.data);

  // console.log(files);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ipcRenderer = window.electron.ipcRenderer;

  useEffect(() => {
    if (Object.keys(spikeData).length !== 0) {
      setSpikesSet(true);
    }
  }, [spikeData]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const analyseOnClick = async () => {
    //Process each file
    // Array.from(files).forEach((fileObject: FileWithPath) => {
    //   const filePath = fileObject.path;

    //   ipcRenderer.on('csv-file-read-reply', (args: any) => {

    //     //should now recieve results instead

    //     const fileRecords: FileRecords = args;

    //     dispatch(setRecords(fileRecords));
    //   });

    //   ipcRenderer.sendMessage('csv-file-read', filePath);
    // });

    //need to convert file objs to serializable before dispatch
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

  return (
    <section className="background">
      <div className="light-overlay">
        <Container>
          <div className="text-center row ">
            <Dropzone setFiles={setFiles}>
              <Stack gap={2}>
                {spikesButton}
                {analyseButton}
              </Stack>
            </Dropzone>
            <Modal
              show={showModal}
              handleCloseModal={handleCloseModal}
              files={files}
            />
          </div>

          {/* Display results here? */}
        </Container>
      </div>
    </section>
  );
};

export default Main;
