import {useEffect, useState} from "react";
import "./app.css";
import Navbar from "./components/Navbar";
import NewPost2 from "./components/NewPost2";
import {fireStore} from "./Firebase";

function App() {
  const [files, setFiles] = useState();
  const [images, setImages] = useState();

  useEffect(() => {
    const getImages = () => {
      const imageArray = [];
      for (const file of files) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          const image = {
            url: img.src,
            width: img.width,
            height: img.height,
          };
          imageArray.push(image);
          if (imageArray.length === files.length) {
            setImages(imageArray);
          }
        };
      }
    };
    getImages();
  }, [files]);

  return (
    <div>
      <Navbar />
      {images && images.length > 0 ? (
        <NewPost2 images={images} />
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
              <div className="App">{fireStore._databaseId.projectId}</div>;
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
