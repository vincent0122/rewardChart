import React, {useState, useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";

const Printer = () => {
  const location = useLocation();
  const images = location.state?.faceImagesSrc;
  const [shape, setShape] = useState("circle");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // Initial white background color
  const canvasRef = useRef(null);
  const [generatedImageURL, setGeneratedImageURL] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    createCanvas(canvas, shape);
  }, [images, shape, backgroundColor]);

  const handleShapeChange = (e) => {
    setShape(e.target.value);
  };

  const handleBackgroundColorChange = (e) => {
    setBackgroundColor(e.target.value);
  };

  const generateImageURL = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    setGeneratedImageURL(dataURL);
  };

  const createCanvas = (canvas, shape) => {
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const numRows = 4;
    const numCols = 4;
    const margin = shape === "circle" ? 10 : 0;
    const cellWidth = (canvas.width - margin * (numCols - 1)) / numCols;
    const cellHeight = (canvas.height - margin * (numRows - 1)) / numRows;

    const slicedImages = [];
    for (let i = 0; i < 16; i++) {
      slicedImages.push(images[i % images.length]);
    }

    slicedImages.forEach((src, index) => {
      const row = Math.floor(index / numCols);
      const col = index % numCols;
      const img = new Image();
      img.src = src;

      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const targetWidth = cellHeight * aspectRatio;
        const targetHeight = cellWidth / aspectRatio;
        const x = col * (cellWidth + margin) + (cellWidth - targetWidth) / 2;
        const y = row * (cellHeight + margin) + (cellHeight - targetHeight) / 2;

        //그림자 그리기
        ctx.beginPath();
        createClipPath(
          ctx,
          shape,
          col * (cellWidth + margin),
          row * (cellHeight + margin),
          cellWidth,
          cellHeight
        );

        //ctx.clip();
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.fillStyle = "black";
        ctx.fill();

        //그림자 그기

        ctx.save();
        ctx.beginPath();
        createClipPath(
          ctx,
          shape,
          col * (cellWidth + margin),
          row * (cellHeight + margin),
          cellWidth,
          cellHeight
        );

        ctx.clip();

        ctx.globalCompositeOperation = "source-over";

        ctx.save();
        ctx.restore();

        ctx.drawImage(img, x, y, targetWidth, targetHeight);
        ctx.lineWidth = 1; // Set the width of the boundary line
        // ctx.strokeStyle = backgroundColor; // Set the color of the boundary line to the selected background color
        // ctx.stroke();

        ctx.restore();

        generateImageURL();
      };
    });
  };

  const createClipPath = (ctx, shape, x, y, width, height) => {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radius = Math.min(width, height) / 2;

    switch (shape) {
      case "circle":
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        break;
      case "heart":
        const yOffset = radius * 0.7;
        ctx.moveTo(centerX, centerY - yOffset);
        ctx.bezierCurveTo(
          centerX - radius * 0.6,
          centerY - radius * 1.1,
          centerX - radius * 1.8,
          centerY,
          centerX,
          centerY + radius * 1
        );
        ctx.bezierCurveTo(
          centerX + radius * 1.8,
          centerY,
          centerX + radius * 0.6,
          centerY - radius * 1.1,
          centerX,
          centerY - yOffset
        );

        ctx.closePath();
        break;

      case "star":
        const spikes = 5;
        const outerRadius = radius;
        const innerRadius = radius * 0.8;
        let rot = (Math.PI / 2) * 3;
        const step = ((Math.PI * 4) / spikes) * 2;

        ctx.moveTo(centerX, centerY - outerRadius);
        for (let i = 1; i <= spikes; i++) {
          const outerX = centerX + Math.cos(rot) * outerRadius;
          const outerY = centerY + Math.sin(rot) * outerRadius;
          ctx.lineTo(outerX, outerY);
          rot += step;
          const innerX = centerX + Math.cos(rot) * innerRadius;
          const innerY = centerY + Math.sin(rot) * innerRadius;
          ctx.lineTo(innerX, innerY);
          rot += step;
        }
        ctx.lineTo(centerX, centerY - outerRadius);
        ctx.closePath();
        break;
      case "triangle":
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX + radius, centerY + radius);
        ctx.lineTo(centerX - radius, centerY + radius);
        ctx.closePath();
        break;
      case "square":
        const cornerRadius = radius * 0.15; // Adjust this value to change the roundness of the corners
        ctx.moveTo(x + cornerRadius, y);
        ctx.lineTo(x + width - cornerRadius - 2, y - 2);
        ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
        ctx.lineTo(x + width, y + height - cornerRadius);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - cornerRadius,
          y + height
        );
        ctx.lineTo(x + cornerRadius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
        ctx.lineTo(x, y + cornerRadius);
        ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
        ctx.closePath();
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <select value={shape} onChange={handleShapeChange}>
        <option value="square">square</option>
        <option value="circle">Circle</option>
        <option value="heart">Heart</option>
        <option value="star">Star</option>
        <option value="ninePointStar">9-pointed Star</option>
        <option value="triangle">triangle</option>
      </select>
      <input
        type="color"
        value={backgroundColor}
        onChange={handleBackgroundColorChange}
      />

      <canvas
        ref={canvasRef}
        id="imageCanvas"
        width="1600"
        height="1600"
        style={{width: "800px", height: "800px", display: "none"}}
      ></canvas>
      <img
        src={generatedImageURL}
        alt="Generated Image"
        style={{width: "800px", height: "800px"}}
      />
    </div>
  );
};

export default Printer;
