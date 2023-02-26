//preview는 보여주기니까 서버에 별도 저장이 필요하다.

import {useEffect, useState} from "react";
import * as faceapi from "face-api.js";
import html2pdf from "html2pdf.js";
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
    // Get the preview element
    const preview = document.getElementById("preview");

    // Set the options for the PDF conversion
    const options = {
      filename: `${name}.pdf`,
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    // Convert the preview element to PDF and download the file
    html2pdf().set(options).from(preview).save();
  };

  const previewWidth = "205mm";
  const faceImageSize = `calc(${previewWidth} / 10 - 10px)`;

  return (
    <div style={{display: "flex"}}>
      <div
        id="preview"
        style={{
          width: previewWidth,
          height: "280mm",
          zoom: "100%",
          border: "1px solid black",
          margin: "10px 0px 0px 10px",
          flex: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "30vh",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
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
            {`${name}`}
          </div>
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
          marginTop: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "30vw",
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
