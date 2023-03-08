import * as faceapi from "face-api.js";
import {collection, addDoc} from "firebase/firestore";
import {firestore} from "./Firebase";

const handleImages = async (images) => {
  const allFaceImages = [];
  const targetSize = 150;
  let faceCounter = 0;

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
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

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

        canvas.width = targetSize;
        canvas.height = targetSize;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(targetSize / 2, targetSize / 2, targetSize / 2, 0, 2 * Math.PI);
        ctx.clip();

        ctx.drawImage(
          img,
          cropBox.x,
          cropBox.y,
          cropBox.width,
          cropBox.height,
          0,
          0,
          targetSize,
          targetSize
        );

        const faceImage = document.createElement("img");
        faceImage.src = canvas.toDataURL("image/jpeg");
        allFaceImages.push(faceImage);
        faceCounter++;
      }

      if (faceCounter >= 50) {
        break;
      }
    }
  }

  // allFaceImages.forEach(async (faceImage) => {
  //   try {
  //     const docRef = await addDoc(collection(firestore, "faces"), {
  //       image: faceImage.src,
  //     });
  //     console.log("Face image added to Firestore with ID: ", docRef.id);
  //   } catch (e) {
  //     console.log("Error adding document to Firestore: ", e);
  //   }
  // });

  return allFaceImages;
};

export default handleImages;

onMouseEnter={(e) => {
  const icon = document.createElement("img");
  icon.src = "Icons/trash.png";
  icon.style.position = "absolute";
  icon.style.right = "0px";
  icon.style.top = "0px";
  icon.style.width = "25px";
  icon.style.height = "25px";
  icon.style.zIndex = "1";
  e.currentTarget.appendChild(icon);
}}
onMouseLeave={(e) => {
  const icon = e.currentTarget.lastChild;
  e.currentTarget.removeChild(icon);
}}
onClick={() => handleDelete(index)}