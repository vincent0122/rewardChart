import {useNavigate} from "react-router-dom";
import {NavDropdown, Dropdown} from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Glyphicon from "@strongdm/glyphicon";

const Navbar2 = () => {
  const navigate = useNavigate();
  return (
    <Navbar style={{backgroundColor: "#0056b3"}} variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              alt=""
              src="/Icons/smile.svg"
              width="30"
              height="30"
              style={{marginRight: "10px"}}
            />{" "}
            Face Detector
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" />
          <Nav className="ms-auto">
            <div className="btn-group dropstart">
              <NavDropdown
                title={
                  <Glyphicon
                    glyph="align-justify"
                    style={{color: "white", fontSize: "1.5em"}}
                  />
                }
                id="collasible-nav-dropdown"
              >
                <Dropdown.Item onClick={() => navigate("/")}>
                  Home
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate("/introduction")}>
                  Document
                </Dropdown.Item>
              </NavDropdown>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbar2;
