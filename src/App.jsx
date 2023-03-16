import {useEffect, useState} from "react";
import "./app.css";
import Navbar from "./components/Navbar";
import NewPost from "./components/NewPost";

function App() {
  const [files, setFiles] = useState();
  const [images, setImages] = useState();

  useEffect(() => {
    const lockScreenOrientation = async () => {
      if (window.screen.orientation) {
        try {
          await window.screen.orientation.lock("portrait");
        } catch (error) {
          console.error("Screen orientation lock not supported:", error);
        }
      }
    };

    lockScreenOrientation();
  }, []);

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

          if (width > 1200 || height > 1200) {
            // Resize image while maintaining aspect ratio
            if (width > height) {
              height = (height / width) * 1200;
              width = 1200;
            } else {
              width = (width / height) * 1200;
              height = 1200;
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

  return (
    <div>
      <Navbar />
      {images && images.length > 0 ? (
        <NewPost images={images} />
      ) : (
        <div className="newPostCard">
          <div className="addPost">
            <div className="postForm">
              <label htmlFor="file">
                <img
                  className="addImg"
                  src={process.env.PUBLIC_URL + "/Icons/upload.svg"}
                  style={{width: "100px", height: "100px"}}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
