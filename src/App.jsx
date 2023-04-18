import "./css/app.css";
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import Navbar from "./components/Navbar";
import PrinterPage from "./components/PrinterPage";
import Home from "./router/Home";
import Main from "./router/Main";
import Printer from "./router/Printer";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />}></Route>
        </Routes>{" "}
      </div>
    </BrowserRouter>
  );
}

export default App;
