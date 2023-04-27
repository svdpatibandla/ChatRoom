// import required components from react-bootstrap and react-router-bootstrap
import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

// import CSS file for the Home component
import "./Home.css";

// function component to render the Home page
function Home() {
    // return JSX elements
    return (
        <Row>
            <Col md={6} className="d-flex flex-direction-column align-items-center justify-content-center">
                <div>
                    <h1>Connect with your friends</h1>
                    {/* Link to the chat page */}
                    <LinkContainer to="/chat">
                        <Button variant="success">
                            Start Conversations <i className="fas fa-comments home-message-icon"></i>
                        </Button>
                    </LinkContainer>
                </div>
            </Col>
            <Col md={6} className=""></Col>
        </Row>
    );
}

// export the Home component as default
export default Home;
