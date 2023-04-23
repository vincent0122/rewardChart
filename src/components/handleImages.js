import * as faceapi from "@vladmandic/face-api";

const handleImages = async (images) => {
  const allFaceImages = [];

  for (let i = 0; i < images.length; i++) {
    if (allFaceImages.length >= 100) {
      alert("Detected face number exceeded 100.");
      break; // check if allFaceImages length is already 100 or more, if yes, break the loop
    }
    const {url} = images[i];
    const img = await faceapi.fetchImage(url);
    const detections = await faceapi.detectAllFaces(
      img,
      new faceapi.SsdMobilenetv1Options()
    );

    for (let j = 0; j < detections.length; j++) {
      const d = detections[j];

      // add check to only process faces if bounding box is larger than 200px
      if (d.box.width > 200 || d.box.height > 200) {
        const canvas = document.createElement("canvas");

        const ctx = canvas.getContext("2d");

        const centerPoint = {
          x: d.box.x + d.box.width / 2,
          y: (d.box.y + d.box.height / 2) * 1,
        };

        let diameter = 1.02 * Math.max(d.box.width, d.box.height);

        // Check if diameter is bigger than the distance to the image edges and adjust if needed
        const distanceToTop = centerPoint.y;
        const distanceToLeft = centerPoint.x;
        const distanceToBottom = img.height - centerPoint.y;
        const distanceToRight = img.width - centerPoint.x;

        const minDistance = Math.min(
          distanceToTop,
          distanceToLeft,
          distanceToBottom,
          distanceToRight
        );
        if (diameter > minDistance) {
          diameter = minDistance;
        }

        const cropBox = {
          x: centerPoint.x - diameter,
          y: centerPoint.y - diameter,
          width: diameter * 2,
          height: diameter * 2,
        };

        canvas.width = diameter * 2;
        canvas.height = diameter * 2;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
          img,
          cropBox.x,
          cropBox.y,
          cropBox.width,
          cropBox.height,
          0,
          0,
          diameter * 2,
          diameter * 2
        );

        const faceImage = document.createElement("img");
        faceImage.src = canvas.toDataURL("image/jpeg");

        allFaceImages.push(faceImage);

        if (allFaceImages.length >= 100) {
          alert("Detected face number exceeded 100.");
          break;
        }
      }
    }
  }

  return allFaceImages;
};

export default handleImages;
