import React from "react";

const FaceImage = ({
  faceImage,
  faceImageSize,
  selectedImages,
  selectedIndex,
  index,
  onImageSelected,
}) => {
  const isSelected = selectedIndex.includes(index);

  const handleClick = () => {
    const newSelectedIndex = isSelected
      ? selectedIndex.filter((i) => i !== index)
      : [...selectedIndex, index];
    onImageSelected(faceImage, newSelectedIndex);
  };

  return (
    <div
      style={{
        width: faceImageSize,
        height: faceImageSize,
        borderRadius: "50%",
        overflow: "hidden",
        margin: "1.5px 1px",
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
              right: "6%",
              bottom: "6%",
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
