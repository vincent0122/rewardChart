import Upscaler from "upscaler";
import x8 from "@upscalerjs/esrgan-thick/8x";

const upscaler = new Upscaler({
  model: x8,
});

const handleUpscaleImage = async (selectedImages) => {
  if (selectedImages.length > 1) {
    alert("Please choose one image only");
    return;
  }
  const selectedImageElement = document.querySelector(
    `img[src="${selectedImages[0].src}"]`
  );

  // Upscale the selected image
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = selectedImages[0].src;
  img.onload = async () => {
    const upscaledImageSrc = await upscaler.upscale(img);
    selectedImageElement.src = upscaledImageSrc;
  };
};

export default handleUpscaleImage;
