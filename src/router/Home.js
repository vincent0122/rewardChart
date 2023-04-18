import {useEffect, useState} from "react";
import React from "react";
import {useNavigate} from "react-router-dom";

const Home = () => {
  const [files, setFiles] = useState();
  const [images, setImages] = useState();
  const navigate = useNavigate();

  const handleImagesLoaded = () => {
    if (images) {
      console.log(images);
      navigate("/main", {state: {images}}); // navigate to "/main" route when images are loaded
    }
  };

  useEffect(() => {
    const getImages = () => {
      const imageArray = [];
      const filesArray = [...files];
      for (const file of filesArray) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > 2200 || height > 2200) {
            // Resize image while maintaining aspect ratio
            if (width > height) {
              height = (height / width) * 2200;
              width = 2200;
            } else {
              width = (width / height) * 2200;
              height = 2200;
            }
          }
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const image = {
            url: canvas.toDataURL("image/jpeg"),
            width,
            height,
          };

          imageArray.push(image);
          if (imageArray.length === filesArray.length) {
            setImages(imageArray);
          }
        };
      }
    };
    if (files) {
      getImages();
    }
  }, [files]);

  useEffect(() => {
    handleImagesLoaded();
  }, [images, navigate]);

  return (
    <div className="newPostCard">
      <div className="postForm">
        <label htmlFor="file">
          <img
            className="addImg"
            src={process.env.PUBLIC_URL + "/Icons/upload.svg"}
            style={{width: "25vh", height: "25vh"}}
            alt=""
          />
        </label>
        <input
          onChange={(e) => setFiles(e.target.files)}
          id="file"
          style={{display: "none"}}
          type="file"
          multiple
        />
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button onClick={() => navigate("/docs")}>
              <img
                src={process.env.PUBLIC_URL + "/Icons/docs.svg"}
                alt="docs"
                style={{
                  width: "10vh",
                  height: "10vh",
                  marginLeft: "5vw",
                }}
              />
            </button>
            <span style={{marginTop: "5px", marginLeft: "5vw"}}>How To</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
