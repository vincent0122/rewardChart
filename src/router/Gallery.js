import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import styles from "../css/Introduction.css";

const Gallary = () => {
  return (
    <Container>
      <Row>
        <Col>
          <img
            src="/gallary/1.png"
            alt="img1"
            className="img-fluid"
            style={{marginTop: "30px"}}
          />
          <img
            src="/gallary/2.jpg"
            alt="img2"
            className="img-fluid"
            style={{marginTop: "30px"}}
          />
          <img
            src="/gallary/3.png"
            alt="img3"
            className="img-fluid"
            style={{marginTop: "30px"}}
          />
          <img
            src="/gallary/4.png"
            alt="img4"
            className="img-fluid"
            style={{marginTop: "30px"}}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Gallary;
