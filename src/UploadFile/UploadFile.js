import { useEffect, useMemo, useState } from "react";

import PropTypes from 'prop-types';
import cn from 'classnames';
import { ReactComponent as RemoveIcon } from './assets/square-xmark-solid.svg';
import { ReactComponent as UploadIcon } from './assets/file-arrow-up-solid.svg';
import { ReactComponent as Spinner } from './assets/spinner-solid.svg';
import { ReactComponent as ErrorIcon } from './assets/file-circle-minus-solid.svg';

import s from "./UploadFile.module.css";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', (event) => resolve(event.target.result));
    reader.addEventListener('error', (error) => reject(error));
    reader.readAsDataURL(file);
  })
}

const getData = (file) => {
  return Object.values(file).map(item => item.file);
}

const formatSize = (size) => {
  return (size / 1024 / 1024).toLocaleString('ru-RU') + ' Мб'
}

const UploadFile = ({ multiple, onFinish }) => {
  const [files, setFiles] = useState([]);
  const isFinish = useMemo(() => Object.keys(files).length > 0 ? Object.values(files).every(item => item.isLoading === false) : false, [files]);

  useEffect(() => {
    if (isFinish) {
      onFinish && onFinish(getData(files));
    }
  }, [isFinish]);

  const updateFileList = (filePayload) => {
    setFiles(prevState => ({
      ...prevState,
      [filePayload.name]: filePayload,
    }));
  }

  const handleChange = (e) => {
    console.log('>>>', e.target.files);

    const fileList = e.target.files;

    for (const file of fileList) {
      updateFileList({
        file,
        name: file.name,
        type: file.type,
        imgUrl: null,
        status: 'OK',
        isLoading: true,
      });

      getBase64(file)
        .then((fileAsBase64) => {
          // console.log('>>> base64', fileAsBase64);
          // throw new Error(file);
          updateFileList({
            file,
            name: file.name,
            type: file.type,
            imgUrl: fileAsBase64,
            status: 'OK',
            isLoading: false,
          });

        })
        .catch((err) => {
          updateFileList({
            file,
            name: file.name,
            type: file.type,
            imgUrl: null,
            status: 'ERROR',
            isLoading: false,
          });
        });
    }
  }

  const handleRemoveClick = (name) => {
    setFiles(prevState => {
      const copyState = { ...prevState };
      delete copyState[name];

      return copyState;
    })
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
            Object.entries(files).map(([key, value], index) => (
              <li
                key={key}
                className={s.previewFile}>
                {value.imgUrl !== null && <img src={value.imgUrl} alt={key} />}
                {value.isLoading && <div className={s.spinner}><Spinner /></div>}
                {value.status === 'ERROR' && <div className={s.error}><ErrorIcon /></div>}
                <div className={s.fileDescription}>
                  <p>{value.name}</p>
                  <p>{formatSize(value.file.size)}</p>
                </div>
                <RemoveIcon
                  className={s.removeIcon}
                  onClick={() => handleRemoveClick(key)}
                />
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
  multiple: PropTypes.bool,
  onFinish: PropTypes.func,
}

export default UploadFile;
