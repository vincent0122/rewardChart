import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import NewPost from "../components/NewPost";

const Main = () => {
  const location = useLocation();
  const images = location.state?.images;
  console.log(images);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (images) {
      setLoading(false);
    }
  }, [images]);

  return loading ? (
    <div>Loading...</div>
  ) : images && images.length > 0 ? (
    <NewPost images={images} />
  ) : (
    <div>No images selected.</div>
  );
};

export default Main;
