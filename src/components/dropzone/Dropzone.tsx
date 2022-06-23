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
        <div className="mx-auto" style={{ width: '50%' }}>
          <form data-testid="dropzone" style={{ width: '100%' }}>
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
