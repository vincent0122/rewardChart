import {useState} from "react";

const PrinterPage = ({onSubmit}) => {
  const [shape, setShape] = useState("circle");
  const [paperSize, setPaperSize] = useState("a4");
  const [imageSize, setImageSize] = useState(50);
  const [margin, setMargin] = useState(10);
  const [title, setTitle] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit({shape, paperSize, imageSize, margin, title});
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor="shape">Shape:</label>
        <select
          id="shape"
          name="shape"
          value={shape}
          onChange={(event) => setShape(event.target.value)}
        >
          <option value="circle">Circle</option>
          <option value="square">Square</option>
          <option value="rounded">Rounded</option>
        </select>
      </div>
      <div>
        <label htmlFor="paperSize">Paper Size:</label>
        <select
          id="paperSize"
          name="paperSize"
          value={paperSize}
          onChange={(event) => setPaperSize(event.target.value)}
        >
          <option value="a4">A4</option>
          <option value="letter">Letter</option>
          <option value="legal">Legal</option>
        </select>
      </div>
      <div>
        <label htmlFor="imageSize">Image Size:</label>
        <input
          type="number"
          id="imageSize"
          name="imageSize"
          value={imageSize}
          onChange={(event) => setImageSize(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="margin">Margin:</label>
        <input
          type="number"
          id="margin"
          name="margin"
          value={margin}
          onChange={(event) => setMargin(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <button type="submit">Print</button>
    </form>
  );
};

export default PrinterPage;
