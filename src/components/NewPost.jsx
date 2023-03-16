//preview는 보여주기니까 서버에 별도 저장이 필요하다.

import {useEffect, useState, useRef} from "react";
import * as faceapi from "face-api.js";
import html2pdf from "html2pdf.js";
import handleImages from "./handleImages";
import FaceImage from "./FaceImage";

const NewPost = ({images}) => {
  const [faceImages, setFaceImages] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [name, setName] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const fileInputRef = useRef(null);

  const handleSelectionClick = () => {
    setSelectionMode(!selectionMode);
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

  const handleDelete = (index) => {
    const newFaceImages = [...faceImages];
    newFaceImages.splice(index, 1);
    setFaceImages(newFaceImages);
  };

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

  const faceImageSize = Math.min(window.innerWidth / 5, window.innerHeight / 5);

  return (
    <div>
      <div style={{display: "flex", justifyContent: "flex-end", width: "100%"}}>
        <button
          onClick={handleSelectionClick}
          style={{
            width: "20%",
            height: "5vh",
            backgroundColor: selectionMode
              ? "hsl(0, 30%, 35%)"
              : "hsl(200, 45%, 55%)",
            color: "white",
            marginRight: "10px",
            marginTop: "10px",
          }}
        >
          {selectionMode ? "취소" : "선택"}
        </button>
        <div style={{display: "flex", justifyContent: "flex-end", flex: 1}}>
          <button
            onClick={handleSave}
            style={{
              width: "25vw",
              height: "10vh",
              background: "transparent",
              border: "none",
              marginRight: "10px",
            }}
          >
            <img
              src="/Icons/save2.svg"
              alt="Save"
              style={{width: "100%", height: "100%"}}
            />
          </button>
          <button
            onClick={() => handleDelete(hoveredIndex)}
            disabled={hoveredIndex === -1}
            style={{
              width: "25vw",
              height: "10vh",
              background: "transparent",
              border: "none",
            }}
          >
            <img
              src="/Icons/trash2.svg"
              alt="Delete"
              style={{width: "100%", height: "100%"}}
            />
          </button>
        </div>
      </div>
      <div
        id="preview"
        style={{
          width: "100vw",
          maxWidth: "220mm",
          minHeight: "280mm",
          border: "1px solid black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
        <div
          style={{
            overflowY: "auto",
            maxHeight: "calc(100vh - 100px)",
            width: "90%",
            paddingBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.5%",
            }}
          >
            {faceImages.map((faceImage, index) => (
              <FaceImage
                key={`${faceImage.src}-${index}`}
                selectionMode={selectionMode}
                faceImage={faceImage}
                faceImageSize={faceImageSize}
                index={index}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          bottom: 0,
          width: "100%",
          backgroundColor: "white",
          padding: "10px",
          borderTop: "1px solid #ccc",
        }}
      >
        <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
          <button onClick={handleSave} style={{width: "60%", height: "5vh"}}>
            Save page
          </button>
          <button
            onClick={handleAddPicture}
            style={{width: "7vw", height: "5vh", marginBottom: "10px"}}
          >
            Add Picture
          </button>

          {/* Hidden file input element */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{display: "none"}}
          />
        </div>
      </div>
    </div>
  );
};

export default NewPost;
