//preview는 보여주기니까 서버에 별도 저장이 필요하다.
//별도 저장할 수 있는 이미지를 새창에서 띄우는게 안된다

import {useEffect, useState, useRef} from "react";
import * as faceapi from "@vladmandic/face-api";
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

  const handlePrintImage = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const columns = 4;
    const faceImageMargin = 10;
    const fullWidth = faceImageSize * columns + faceImageMargin * (columns + 1);
    const fullHeight =
      faceImageSize * Math.ceil(faceImages.length / columns) +
      faceImageMargin * (Math.ceil(faceImages.length / columns) + 1);

    canvas.width = fullWidth;
    canvas.height = fullHeight;

    faceImages.forEach((faceImage, index) => {
      const x =
        (index % columns) * (faceImageSize + faceImageMargin) + faceImageMargin;
      const y =
        Math.floor(index / columns) * (faceImageSize + faceImageMargin) +
        faceImageMargin;
      const img = new Image();
      img.src = faceImage.src;
      img.onload = () => {
        const originalWidth = img.naturalWidth;
        const originalHeight = img.naturalHeight;
        const aspectRatio = originalWidth / originalHeight;
        const targetWidth = faceImageSize;
        const targetHeight = faceImageSize / aspectRatio;

        context.drawImage(img, x, y, targetWidth, targetHeight);
      };
    });

    setTimeout(() => {
      const dataURL = canvas.toDataURL("image/png");
      const newWindow = window.open();
      newWindow.document.write(
        `<img src="${dataURL}" width="${fullWidth}" height="${fullHeight}"/>`
      );
    }, 1000);
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
              index={index}
              onImageSelected={handleImageSelected}
            />
          ))}
        </div>
      </div>
      <div className={styles.bottomBar}>
        <button className={styles.bottomButton} style={{marginBottom: "30px"}}>
          <img
            src="/Icons/upscale.svg"
            alt="Quality"
            style={{width: "100%", height: "120%"}}
          />
        </button>
        <button
          onTouchEnd={handlePrintImage}
          onClick={handlePrintImage}
          className={styles.bottomButton}
        >
          <img
            src="/Icons/printer.svg"
            alt="Printer"
            style={{width: "100%", height: "100%"}}
          />
        </button>
        <button onTouchEnd={handleAddPicture} className={styles.bottomButton}>
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
