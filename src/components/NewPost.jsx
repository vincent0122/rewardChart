//preview는 보여주기니까 서버에 별도 저장이 필요하다.
//별도 저장할 수 있는 이미지를 새창에서 띄우는게 안된다

import {useEffect, useState, useRef} from "react";
import * as faceapi from "@vladmandic/face-api";
import handleImages from "./handleImages";
import handlePrintImage from "./handlePrint";
import FaceImage from "./FaceImage";
import styles from "../css/NewPost.module.css";
import {useNavigate} from "react-router-dom";

const NewPost = ({images}) => {
  const navigate = useNavigate();
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
    // Convert the file to a data URL
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const url = reader.result;

      // Process the new image and add detected faces to the existing face images
      const newFaceImages = await handleImages([{url}]);
      setFaceImages([...faceImages, ...newFaceImages]);
    };
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
        <div className={styles.faceImagesWrapper}>
          {faceImages.map((faceImage, index) => (
            <FaceImage
              key={`${faceImage.src}-${index}`}
              faceImage={faceImage}
              faceImageSize={faceImageSize}
              selectedImages={selectedImages}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              index={index}
              onImageSelected={handleImageSelected}
            />
          ))}
        </div>
      </div>
      <div className={styles.bottomBar}>
        <button
          onClick={() => navigate("/")}
          onTouchEnd={() => navigate("/")}
          className={styles.bottomButton}
        >
          <img
            src="/Icons/home.svg"
            alt="Home"
            style={{width: "100%", height: "100%"}}
          />
        </button>

        <button onClick={handleAddPicture} className={styles.bottomButton}>
          <img
            src="/Icons/addImage.svg"
            alt="Add"
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
        <button
          onClick={() => navigate("/printer")}
          onTouchEnd={() => navigate("/printer")}
          className={styles.bottomButton}
        >
          <img
            src="/Icons/star_yellow.svg"
            alt="Star"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </button>
        <button
          onClick={() => navigate("/docs")}
          className={styles.bottomButton}
        >
          <img
            src="/Icons/docs.svg"
            alt="docs"
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
