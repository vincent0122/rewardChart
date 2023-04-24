import React from "react";

const FaceImage = ({
  faceImage,
  faceImageSize,
  selectedIndex,
  index,
  onImageSelected,
}) => {
  const isSelected = selectedIndex.includes(index);

  const handleClick = () => {
    onImageSelected(faceImage, !isSelected, index);
  };

  return (
    <div
      style={{
        width: faceImageSize,
        height: faceImageSize,
        borderRadius: "5%",
        overflow: "hidden",
        margin: "1px 1px",
        position: "relative",
      }}
      onClick={handleClick}
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
      {/* Add the overlay and checkmark code here */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <img
            src="Icons/checked.png"
            alt="Selected"
            style={{
              position: "absolute",
              right: "1%",
              bottom: "1%",
              width: "50%",
              height: "50%",
              borderRadius: "50%",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FaceImage;
