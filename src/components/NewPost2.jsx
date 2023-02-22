import {useEffect, useRef, useState} from "react";
import * as faceapi from "face-api.js";
import {firestore} from "../Firebase";

const NewPost2 = ({images}) => {
  const [faceImages, setFaceImages] = useState([]);
  const canvasRef = useRef();

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
  }, []);

  const handleImages = async () => {
    const allFaceImages = [];

    for (let i = 0; i < images.length; i++) {
      const {url} = images[i];
      const img = await faceapi.fetchImage(url);
      const detections = await faceapi.detectAllFaces(
        img,
        new faceapi.SsdMobilenetv1Options()
      );

      const imageFaces = detections.map((d, i) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = d.box.width;
        canvas.height = d.box.height;
        ctx.drawImage(
          img,
          d.box.x,
          d.box.y,
          d.box.width,
          d.box.height,
          0,
          0,
          d.box.width,
          d.box.height
        );
        return canvas.toDataURL("image/jpeg");
      });

      allFaceImages.push(...imageFaces);
    }

    setFaceImages(allFaceImages);

    // Save to Firestore
    const collectionRef = firestore().collection("faces");
    allFaceImages.forEach((faceImage, i) => {
      collectionRef
        .add({
          image: faceImage,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => console.log("Face image added to Firestore"))
        .catch((e) => console.log(e));
    });
  };

  return (
    <div className="container">
      <div className="left" style={{width: 300, height: 300}}>
        <img crossOrigin="anonymous" src={images[0] && images[0].url} alt="" />
        <canvas ref={canvasRef} />
      </div>
      <div className="right">
        <h1>Share your post</h1>
        <button className="rightButton">Send</button>
      </div>
    </div>
  );
};

export default NewPost2;
