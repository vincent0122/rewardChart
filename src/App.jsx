import {useEffect, useState} from "react";
import "./app.css";
import Navbar from "./components/Navbar";
//import NewPost from "./components/NewPost";
import NewPost2 from "./components/NewPost2";
import {fireStore} from "./Firebase";

function App() {
  const [file, setFile] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    const getImage = () => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage({
          url: img.src,
          width: img.width,
          height: img.height,
        });
      };
    };

    file && getImage();
  }, [file]);

  return (
    <div>
      <Navbar />
      {image ? (
        <NewPost2 image={image} />
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
                onChange={(e) => setFile(e.target.files[0])}
                id="file"
                style={{display: "none"}}
                type="file"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
