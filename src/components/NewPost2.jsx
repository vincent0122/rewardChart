import {useEffect, useState} from "react";
import * as faceapi from "face-api.js";
import {collection, addDoc} from "firebase/firestore";
import {firestore} from "./Firebase";

const NewPost2 = ({images}) => {
  const [faceImages, setFaceImages] = useState([]);

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      handleImages();
    };

    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const handleImages = async () => {
    const allFaceImages = [];

    for (let i = 0; i < images.length; i++) {
      const {url} = images[i];
      const img = await faceapi.fetchImage(url);
      const detections = await faceapi.detectAllFaces(
        img,
        new faceapi.SsdMobilenetv1Options()
      );

      const targetSize = 150;

      const imageFaces = detections.map((d, i) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const centerPoint = {
          x: d.box.x + d.box.width / 2,
          y: d.box.y + d.box.height / 2,
        };

        const cropBox = {
          x: centerPoint.x - targetSize / 2,
          y: centerPoint.y - targetSize / 2,
          width: targetSize,
          height: targetSize,
        };

        canvas.width = targetSize;
        canvas.height = targetSize;

        ctx.drawImage(
          img,
          cropBox.x,
          cropBox.y,
          cropBox.width,
          cropBox.height,
          0,
          0,
          targetSize,
          targetSize
        );

        const faceImage = document.createElement("img");
        faceImage.src = canvas.toDataURL("image/jpeg");
        return faceImage;
      });

      allFaceImages.push(...imageFaces);
    }

    setFaceImages(allFaceImages);

    // Save to Firestore

    allFaceImages.forEach(async (faceImage) => {
      try {
        const docRef = await addDoc(collection(firestore, "faces"), {
          image: faceImage.src,
        });
        console.log("Face image added to Firestore with ID: ", docRef.id);
      } catch (e) {
        console.log("Error adding document to Firestore: ", e);
      }
    });
  };

  return (
    <div className="container">
      <div className="left" style={{display: "flex", flexWrap: "wrap"}}>
        {faceImages.map((faceImage) => (
          <img
            key={faceImage.src}
            crossOrigin="anonymous"
            src={faceImage.src}
            alt=""
            style={{width: "150px", height: "150px", objectFit: "cover"}}
          />
        ))}
      </div>
    </div>
  );
};

export default NewPost2;
