import "./css/app.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Navbar2 from "./components/Navbar";
import Home from "./router/Home";
import Main from "./router/Main";
import Printer from "./router/Printer";
import Introduction from "./router/Introduction";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar2 />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />}></Route>
          <Route path="/printer" element={<Printer />}></Route>
          <Route path="/introduction" element={<Introduction />}></Route>
        </Routes>{" "}
      </div>
    </BrowserRouter>
  );
}

export default App;
