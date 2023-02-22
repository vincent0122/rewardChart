import {useEffect, useRef, useState} from "react";
import * as faceapi from "face-api.js";

const NewPost2 = ({image}) => {
  const {url, width, height} = image;
  const [faces, setFaces] = useState([]);

  const imgRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };

    imgRef.current && loadModels();
  }, []);

  const handleImage = async () => {
    const detections = await faceapi.detectAllFaces(
      imgRef.current,
      new faceapi.SsdMobilenetv1Options()
    );
    setFaces(detections.map((d) => Object.values(d.box)));
  };

  return (
    <div className="container">
      <div className="left" style={{width, height}}>
        <img ref={imgRef} crossOrigin="anonymous" src={url} alt="" />
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
      <div className="right">
        <h1>Share your post</h1>
        <button className="rightButton">Send</button>
      </div>
    </div>
  );
};

export default NewPost2;
