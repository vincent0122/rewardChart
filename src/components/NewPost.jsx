import {useEffect, useState} from "react";
import * as faceapi from "face-api.js";
import {collection, addDoc} from "firebase/firestore";
import {firestore} from "./Firebase";
import {jsPDF} from "jspdf";
import handleImages from "./handleImages";

const NewPost2 = ({images}) => {
  const [faceImages, setFaceImages] = useState([]);

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      const allFaceImages = await handleImages(images);
      setFaceImages(allFaceImages);
    };

    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // Save to Firestore

  // allFaceImages.forEach(async (faceImage) => {
  //   try {
  //     const docRef = await addDoc(collection(firestore, "faces"), {
  //       image: faceImage.src,
  //     });
  //     console.log("Face image added to Firestore with ID: ", docRef.id);
  //   } catch (e) {
  //     console.log("Error adding document to Firestore: ", e);
  //   }
  // });

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
