// Import required dependencies from external libraries
import React, { useContext, useState } from "react";
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";
import { useLoginUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";

// Import context
import { AppContext } from "../context/appContext";

// Define Login component
function Login() {

    // Set initial state using useState hooks
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // Use navigate hook for programmatic navigation
    const navigate = useNavigate();

    // Access global context object
    const { socket } = useContext(AppContext);

    // Use custom mutation hook to handle user login
    const [loginUser, { isLoading, error }] = useLoginUserMutation();

    // Define function to handle login event
    function handleLogin(e) {
        e.preventDefault();
        // Send login request to server using custom hook
        loginUser({ email, password }).then(({ data }) => {
            if (data) {
                // If login successful, emit "new-user" event to server
                socket.emit("new-user");
                // Navigate to chat page
                navigate("/chat");
            }
        });
    }

    // Render login form
    return (
        <Container>
            <Row>
                <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
                    <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            {error && <p className="alert alert-danger">{error.data}</p>}
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {isLoading ? <Spinner animation="grow" /> : "Login"}
                        </Button>
                        <div className="py-4">
                            <p className="text-center">
                                Don't have an account ? <Link to="/signup">Signup</Link>
                            </p>
                        </div>
                    </Form>
                </Col>
                <Col md={5} className="login__bg"></Col>
            </Row>
        </Container>
    );
}

// Export Login component as the default module
export default Login;
