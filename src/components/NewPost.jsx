//preview는 보여주기니까 서버에 별도 저장이 필요하다.

import {useEffect, useState} from "react";
import * as faceapi from "face-api.js";
import {collection, addDoc} from "firebase/firestore";
import {firestore} from "./Firebase";
import {jsPDF} from "jspdf";
import html2pdf from "html2pdf.js";
import handleImages from "./handleImages";

const NewPost = ({images}) => {
  const [name, setName] = useState("");
  const [canvas, setCanvas] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      const canvas = await handleImages(images);
      setCanvas(canvas);
    };

    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  return (
    <div>
      {canvas && <img src={canvas.toDataURL("image/jpeg")} alt="Face images" />}
    </div>
  );
};

export default NewPost;
