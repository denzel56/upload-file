import { useState } from "react";

import PropTypes from 'prop-types';
import cn from 'classnames';
import { ReactComponent as RemoveIcon } from './assets/square-xmark-solid.svg';
import { ReactComponent as UploadIcon } from './assets/file-arrow-up-solid.svg';

import s from "./UploadFile.module.css";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', (event) => resolve(event.target.result));
    reader.addEventListener('error', (error) => reject(error));
    reader.readAsDataURL(file);
  })
}

const UploadFile = ({ multiple }) => {
  const [files, setFiles] = useState([]);
  console.log('>>> files', files);

  const handleChange = (e) => {
    console.log('>>>', e.target.files);

    const fileList = e.target.files;

    for (const file of fileList) {
      console.log('>>> file', file);

      getBase64(file).then((fileAsBase64) => {
        // console.log('>>> base64', fileAsBase64);
        setFiles(prevState => {
          const copyState = [...prevState];

          copyState.push(fileAsBase64);

          return copyState;
        });
      })
    }
  }

  return (
    <div className={s.root}>
      <label className={s.dropZone}>
        <UploadIcon />
        <input
          onChange={handleChange}
          type="file"
          multiple={multiple}
        />
      </label>
      <div className={s.preivewFileContainer}>
        <ul className={s.previewList}>
          {
            files.map((item, index) => (
              <li
                key={index}
                className={s.previewFile}>
                <img src={item} alt="img" />
                <RemoveIcon className={s.removeIcon} />
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

UploadFile.defaultProps = {
  multiple: false
}

UploadFile.propTypes = {
  multiple: PropTypes.bool
}

export default UploadFile;
