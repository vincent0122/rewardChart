//preview는 보여주기니까 서버에 별도 저장이 필요하다.

import {useEffect, useState, useRef} from "react";
import * as faceapi from "face-api.js";
import handleImages from "./handleImages";
import FaceImage from "./FaceImage";
import styles from "../css/NewPost.module.css";

const NewPost = ({images}) => {
  const [faceImages, setFaceImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageSelected = (image, isSelected, index) => {
    if (isSelected) {
      setSelectedImages([...selectedImages, image]);
      setSelectedIndex([...selectedIndex, index]);
    } else {
      setSelectedImages(selectedImages.filter((img) => img.src !== image.src));
      setSelectedIndex(selectedIndex.filter((i) => i !== index));
    }
  };

  const handleAddPicture = () => {
    // Trigger click event on the hidden file input
    fileInputRef.current.click();
  };

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        // faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        // faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      const allFaceImages = await handleImages(images);
      setFaceImages(allFaceImages);
    };

    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const handleDeleteSelected = () => {
    const newFaceImages = faceImages.filter(
      (_, index) => !selectedIndex.includes(index)
    );
    setFaceImages(newFaceImages);
    setSelectedIndex([]);
  };

  // Convert the preview element to PDF and download the file

  const faceImageSize = Math.min(window.innerWidth / 5, window.innerHeight / 5);

  return (
    <div className={styles.topBar}>
      <div id="preview" className={styles.preview}>
        <div></div>
        <div className={styles.faceImagesWrapper}>
          {faceImages.map((faceImage, index) => (
            <FaceImage
              key={`${faceImage.src}-${index}`}
              faceImage={faceImage}
              faceImageSize={faceImageSize}
              index={index}
              onImageSelected={handleImageSelected}
            />
          ))}
        </div>
      </div>
      <div className={styles.bottomBar}>
        <button onClick={handleAddPicture} className={styles.bottomButton}>
          <img
            src="/Icons/addImage.png"
            alt="Delete"
            style={{width: "100%", height: "100%"}}
          />
        </button>
        <button
          onClick={() => handleDeleteSelected()}
          className={styles.bottomButton}
        >
          <img
            src="/Icons/trash2.svg"
            alt="Delete"
            style={{width: "100%", height: "100%"}}
          />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{display: "none"}}
        />
      </div>
    </div>
  );
};

export default NewPost;
