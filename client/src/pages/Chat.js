// Import necessary components from React Bootstrap and our own custom components
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import MessageForm from "../components/MessageForm";

// Define the Chat component
function Chat() {
    // Render the sidebar and message form components within a container with two columns
    return (
        <Container>
            <Row>
                <Col md={4}>
                    <Sidebar />
                </Col>
                <Col md={8}>
                    <MessageForm />
                </Col>
            </Row>
        </Container>
    );
}

// Export the Chat component
export default Chat;
