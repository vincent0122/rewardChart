import React from "react";
import {Container, Row, Col} from "react-bootstrap";

const Introduction = () => {
  return (
    <Container style={{marginTop: "3vh"}}>
      <Row>
        <Col>
          <h1>Welcome to Face Icon App</h1>
          <p>
            Face Icon App is a React-based application that detects faces in
            your images and creates small face icons.
          </p>
          <h2>App Features</h2>
          <ul>
            <li>
              Developed using ReactJS for a fast and responsive user experience
            </li>
            <li>Automatically detects faces and creates small face icons</li>
            <li>
              Download face icons by long-pressing on the icon (using your
              mobile device&apos;s native functionality)
            </li>
            <li>
              Images uploaded are not stored anywhere, ensuring privacy and
              security
            </li>
            <li>Explore many interesting face icon creations</li>
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
