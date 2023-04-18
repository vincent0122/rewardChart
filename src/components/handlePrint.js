import jsPDF from "jspdf";
//import {printOptions} from "./printOptions";

const handlePrintImage = (faceImages, printOptions) => {
  const {shape, paperSize, imageSize, margin, title} = printOptions;

  const doc = new jsPDF({
    orientation: "landscape",
    format: paperSize,
  });

  const rows = Math.ceil(faceImages.length / 4);
  const imageSpacing = margin + imageSize;

  let currentRow = 0;
  let currentColumn = 0;
  faceImages.forEach((faceImage, index) => {
    const x = margin + currentColumn * imageSpacing;
    const y = margin + currentRow * imageSpacing;

    if (shape === "circle") {
      doc.circle(x + imageSize / 2, y + imageSize / 2, imageSize / 2, "S");
    } else if (shape === "square") {
      doc.rect(x, y, imageSize, imageSize, "S");
    } else if (shape === "rounded") {
      doc.roundedRect(x, y, imageSize, imageSize, 5, 5, "S");
    }

    doc.addImage(faceImage.src, "JPEG", x, y, imageSize, imageSize);

    currentColumn += 1;
    if (currentColumn === 4) {
      currentRow += 1;
      currentColumn = 0;
    }

    if (currentRow >= rows) {
      doc.addPage();
      currentRow = 0;
      currentColumn = 0;
    }
  });

  if (title) {
    doc.setFontSize(20);
    doc.text(title, 20, 20);
  }

  doc.save("face_images.pdf");
};

export default handlePrintImage;
