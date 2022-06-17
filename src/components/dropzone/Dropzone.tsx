import React from 'react';

type Props = {
  children: React.ReactNode;
  setFiles: (target: any) => void;
};

const Dropzone: React.FC<Props> = (props) => {
  const { setFiles, children } = props;

  const onChangeHandler = (e: any) => {
    setFiles(e.target.files);
  };
  return (
    <div className="container">
      <div className="row">
        {/* <h1 className="main-color">File Upload</h1> */}
        <div className="mx-auto">
          <form data-testid="dropzone">
            <div className="form-group color files my-2">
              <label></label>
              <input
                data-testid="dropzone-input"
                type={'file'}
                className="form-control "
                accept=".csv, .blast, .tsv"
                multiple
                onChange={onChangeHandler}
              ></input>
            </div>
          </form>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dropzone;
