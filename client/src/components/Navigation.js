// Importing necessary libraries and components
import React from "react";
import { Nav, Navbar, Container, Button, NavDropdown } from "react-bootstrap";
import { useLogoutUserMutation } from "../services/appApi";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/logo.png";

// Defining Navigation component
function Navigation() {
    // Selecting user from state using useSelector hook
    const user = useSelector((state) => state.user);

    // Using useLogoutUserMutation hook to define logoutUser function
    const [logoutUser] = useLogoutUserMutation();

    // Defining handleLogout function to handle user logout
    async function handleLogout(e) {
        e.preventDefault();
        await logoutUser(user);
        // redirect to home page
        window.location.replace("/");
    }

    // Rendering Navbar with React-Bootstrap components
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>
                        <img src={logo} style={{ width: 80, height: 50 }} />
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {/* If user is not logged in, show Login link */}
                        {!user && (
                            <LinkContainer to="/login">
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                        )}
                        {/* Always show Chat link */}
                        <LinkContainer to="/chat">
                            <Nav.Link>Chat</Nav.Link>
                        </LinkContainer>
                        {/* If user is logged in, show dropdown menu with user's name and Logout button */}
                        {user && (
                            <NavDropdown
                                title={
                                    <>
                                        {user.name}
                                    </>
                                }
                                id="basic-nav-dropdown"
                            >
                                <NavDropdown.Item>
                                    <Button variant="danger" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

// Exporting Navigation component as the default module
export default Navigation;
