import {useEffect, useState} from "react";
import * as faceapi from "face-api.js";
import {collection, addDoc} from "firebase/firestore";
import {firestore} from "./Firebase";
import {jsPDF} from "jspdf";
import handleImages from "./handleImages";

const NewPost = ({images}) => {
  const [faceImages, setFaceImages] = useState([]);
  const [name, setName] = useState("");

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

  const handleSave = () => {
    const doc = document.getElementById("preview");
    const pdf = new jsPDF("landscape", "mm", "a4");

    pdf.html(doc, 10, 10, {
      width: 190,
    });

    pdf.save(`${name}'s Reward Chart.pdf`);
  };

  const previewWidth = "70vw";
  const faceImageSize = `calc(${previewWidth} / 8 - 10px)`;

  return (
    <div style={{display: "flex", justifyContent: "space-between"}}>
      <div
        id="preview"
        style={{
          width: previewWidth,
          height: "calc(70vw * 1.414)",
          border: "1px solid black",
          marginTop: "5px",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "blue",
            margin: "10px",
          }}
        >
          {`${name}'s Reward Chart`}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexWrap: "wrap",
            margin: "10px",
          }}
        >
          {faceImages.map((faceImage, index) => (
            <div
              key={`${faceImage.src}-${index}`}
              style={{
                width: faceImageSize,
                height: faceImageSize,
                borderRadius: "50%",
                overflow: "hidden",
                margin: "3px 2px",
              }}
            >
              <img
                crossOrigin="anonymous"
                src={faceImage.src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          marginLeft: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "30vw",
            marginTop: "5px",
          }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{marginRight: "10px", width: "18vw", height: "5vh"}}
          />
          <button onClick={handleSave} style={{width: "7vw", height: "5vh"}}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
