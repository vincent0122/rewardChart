import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";

const Printer = () => {
  const location = useLocation();
  console.log(location.state);
  const images = location.state?.faceImagesSrc;
  const [loading, setLoading] = useState(true);
  console.log(images);

  useEffect(() => {
    if (images) {
      setLoading(false);
    }
  }, [images]);

  return loading ? (
    <div>Loading...</div>
  ) : images ? (
    <img src={images[0]} alt="example" />
  ) : (
    <div>No images selected.</div>
  );
};

export default Printer;
