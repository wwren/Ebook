import axios from 'axios';
import { useState } from 'react';
import { Group, Text, useMantineTheme, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';

const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const CONVERSION_1Mb_TO_BYTE = 1000000;

export function DropzoneContainer({ setContent }) {
  const [image, setImage] = useState({ preview: '', data: '' });
  const [showFileSizeError, setFileSizeError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://australia-southeast2-translate-ebook.cloudfunctions.net/ocrExtractTextFromImg',
        { base64Data: image.data },
        {
          headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
          },
        },
      );

      const data = response.data.data;
      // setText(data);
      setContent(data);
    } catch (e) {
      console('e', e);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file.size >= CONVERSION_1Mb_TO_BYTE) {
      setFileSizeError(true);
      return;
    }

    setFileSizeError(false);
    const base64 = await convertBase64(file);
    setImage({
      data: base64,
    });
  };

  return (
    <div className="App">
      <h1>Upload to server</h1>
      {image.data && <img src={image.data} width="100" height="100" />}
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" onChange={handleFileChange}></input>
        <button type="submit">Submit</button>
      </form>
      {showFileSizeError && <h4>File size needs to be smaller than 1Mb</h4>}
    </div>
  );
}
