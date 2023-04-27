import React from "react";
import {Link} from "react-router-dom";
import {Container, Row, Col} from "react-bootstrap";
import styles from "../css/Introduction.css";

const Introduction = () => {
  return (
    <Container style={{marginTop: "3vh"}}>
      <Row>
        <Col>
          <h1>Welcome to Face Icon App</h1>
          <p style={{marginBottom: "20px"}}>
            Face Icon App <strong>DETECTS</strong> faces in your images and
            creates new images
          </p>
          <h2>App Features</h2>
          <ul>
            <li>This App makes square image. You can upload to instagram.</li>
            <img
              src="/gallary/2.jpg"
              alt="img2"
              className="img-fluid"
              style={{marginBottom: "20px"}}
            />

            <li>
              This app can detect face not only from photo but also from
              drawings.
            </li>
            <img
              src="/gallary/3.PNG"
              alt="img3"
              className="img-fluid"
              style={{marginBottom: "20px"}}
            />
            <li>
              Images uploaded are not stored anywhere, ensuring privacy and
              security
            </li>
            <li>
              To ensure usable results, face icons are only generated if the
              detected face size is greater than 200px.
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default Introduction;
