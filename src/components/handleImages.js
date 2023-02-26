import * as faceapi from "face-api.js";
import {collection, addDoc} from "firebase/firestore";
import {firestore} from "./Firebase";

const handleImages = async (images) => {
  const allFaceImages = [];
  const targetSize = 160;
  const imagesPerRow = 8;
  const rowsPerPage = 6;
  const pageSize = {
    width: 2000, // A4 page width in mm
    height: 3000, // A4 page height in mm
  };

  let faceCounter = 0;

  // Create a new canvas element with A4 dimensions
  const canvas = document.createElement("canvas");
  canvas.width = pageSize.width;
  canvas.height = pageSize.height;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  while (faceCounter < 50) {
    for (let i = 0; i < images.length; i++) {
      const {url} = images[i];
      const img = await faceapi.fetchImage(url);
      const detections = await faceapi.detectAllFaces(
        img,
        new faceapi.SsdMobilenetv1Options()
      );

      for (let j = 0; j < detections.length; j++) {
        if (faceCounter >= 50) {
          break;
        }
        const d = detections[j];

        const centerPoint = {
          x: d.box.x + d.box.width / 2,
          y: d.box.y + d.box.height / 2,
        };

        const cropBox = {
          x: centerPoint.x - targetSize / 2,
          y: centerPoint.y - targetSize / 2,
          width: targetSize,
          height: targetSize,
        };

        // Calculate the position of the current image within the canvas
        const row = Math.floor(faceCounter / imagesPerRow);
        const col = faceCounter % imagesPerRow;
        const margin = 10;
        const x =
          (canvas.width -
            (imagesPerRow * targetSize + (imagesPerRow - 1) * margin)) /
            2 +
          col * (targetSize + margin);
        const y =
          (canvas.height -
            (rowsPerPage * targetSize + (rowsPerPage - 1) * margin)) /
            2 +
          row * (targetSize + margin);

        // Draw the current image onto the canvas
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          x + targetSize / 2,
          y + targetSize / 2,
          targetSize / 2,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
          img,
          cropBox.x,
          cropBox.y,
          cropBox.width,
          cropBox.height,
          x,
          y,
          targetSize,
          targetSize
        );

        ctx.restore();

        faceCounter++;
      }

      if (faceCounter >= 50) {
        break;
      }
    }
  }

  // Convert the canvas to a data URL
  const dataURL = canvas.toDataURL("image/jpeg");

  // Create an image element and set its source to the canvas data URL
  const img = document.createElement("img");
  img.src = dataURL;

  // try {
  //   // Add the data URL to Firestore
  //   const docRef = await addDoc(collection(firestore, "faces"), {
  //     image: dataURL,
  //   });
  //   console.log("Face image added to Firestore with ID: ", docRef.id);
  // } catch (e) {
  //   console.log("Error adding document to Firestore: ", e);
  // }

  // Return the canvas with the face images
  return canvas;
};

export default handleImages;
