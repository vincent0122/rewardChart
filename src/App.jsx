import "./css/app.css";
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import Navbar from "./components/Navbar";
import PrinterPage from "./components/PrinterPage";
import Home from "./router/Home";
import Main from "./router/Main";
import Printer from "./router/Printer";
import Docs from "./router/Docs";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />}></Route>
          <Route path="/printer" element={<Printer />}></Route>
          <Route path="/docs" element={<Docs />}></Route>
        </Routes>{" "}
      </div>
    </BrowserRouter>
  );
}

export default App;
