import {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import React from "react";
import * as faceapi from "@vladmandic/face-api";
import handleImages from "./handleImages";
import FaceImage from "./FaceImage";
import styles from "../css/NewPost.module.css";
import PropTypes from "prop-types";

const NewPost = ({images}) => {
  const [faceImages, setFaceImages] = useState([]);
  const [faceImagesSrc, setFaceImagesSrc] = useState([]);

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageSelected = (image, isSelected, index) => {
    if (isSelected) {
      setSelectedImages([...selectedImages, image]);
      setSelectedIndex([...selectedIndex, index]);
    } else {
      setSelectedImages(selectedImages.filter((img) => img.src !== image.src));
      setSelectedIndex(selectedIndex.filter((i) => i !== index));
    }
  };

  useEffect(() => {
    // Extract the src attribute from each img element in faceImages
    const srcArray = faceImages.map((img) => img.src);

    // Update faceImagesSrc state with the srcArray
    setFaceImagesSrc(srcArray);
  }, [faceImages]);

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

  const handlePrint = () => {
    if (faceImages && faceImages.length > 0) {
      navigate("/printer", {state: {faceImagesSrc}}); // navigate to "/printer" route when images are loaded
    }
  };

  const faceImageSize = Math.min(window.innerWidth / 5, window.innerHeight / 5);

  return (
    <div>
      <div
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        If you want to save individual photos, please use long press.
      </div>

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
          onClick={() => handlePrint()}
          onTouchEnd={() => handlePrint()}
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

NewPost.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
};
