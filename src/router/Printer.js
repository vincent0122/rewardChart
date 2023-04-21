import React, {useState, useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";

const Printer = () => {
  const location = useLocation();
  const images = location.state?.faceImagesSrc;
  const [shape, setShape] = useState("circle");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // Initial white background color
  const canvasRef = useRef(null);

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
        const aspectRatio = img.width / img.height;
        const targetWidth = cellHeight * aspectRatio;
        const targetHeight = cellWidth / aspectRatio;
        const x = col * (cellWidth + margin) + (cellWidth - targetWidth) / 2;
        const y = row * (cellHeight + margin) + (cellHeight - targetHeight) / 2;

        ctx.globalCompositeOperation = "source-over";

        ctx.drawImage(img, x, y, targetWidth, targetHeight);
        ctx.lineWidth = 1; // Set the width of the boundary line
        ctx.strokeStyle = backgroundColor; // Set the color of the boundary line to the selected background color

        ctx.beginPath();
        createClipPath(
          ctx,
          shape,
          col * (cellWidth + margin),
          row * (cellHeight + margin),
          cellWidth,
          cellHeight
        );
        ctx.stroke();
        ctx.restore();
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
        ctx.s = "pink";
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
      case "ninePointStar":
        const nSpikes = 9;
        const nOuterRadius = radius;
        const nInnerRadius = radius / 2.5;
        const nAngle = Math.PI / nSpikes;

        ctx.moveTo(centerX, centerY - nOuterRadius);
        for (let i = 0; i < nSpikes; i++) {
          ctx.lineTo(
            centerX + Math.cos(nAngle * i) * nInnerRadius,
            centerY - Math.sin(nAngle * i) * nInnerRadius
          );
          ctx.lineTo(
            centerX + Math.cos(nAngle * i + nAngle / 2) * nOuterRadius,
            centerY - Math.sin(nAngle * i + nAngle / 2) * nOuterRadius
          );
        }
        ctx.closePath();
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <select value={shape} onChange={handleShapeChange}>
        <option value="circle">Circle</option>
        <option value="heart">Heart</option>
        <option value="star">Star</option>
        <option value="ninePointStar">9-pointed Star</option>
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
        style={{width: "800px", height: "800px"}}
      ></canvas>
    </div>
  );
};

export default Printer;
