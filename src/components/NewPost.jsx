import {useEffect, useRef, useState} from "react";
import * as faceapi from "face-api.js";

const NewPost = ({image}) => {
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

  const enter = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 3;
    ctx.strokeStyle = "yellow";
    faces.map((face) => ctx.strokeRect(...face));
  };

  return (
    <div className="container">
      <div className="left" style={{width, height}}>
        <img ref={imgRef} crossOrigin="anonymous" src={url} alt="" />
        <canvas
          onMouseEnter={enter}
          ref={canvasRef}
          width={width}
          height={height}
        />
      </div>
      <div className="right">
        <h1>Share your post</h1>
        <input
          type="text"
          placeholder="What's on your mind?"
          className="rightInput"
        />
        <button className="rightButton">Send</button>
      </div>
    </div>
  );
};

export default NewPost;
