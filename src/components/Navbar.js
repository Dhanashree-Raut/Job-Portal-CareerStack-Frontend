import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AppNavbar = () => {
    const { user, logout } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        setLoggingOut(true);
        await logout();
        navigate('/login');
        setLoggingOut(false);
    };

    return (
        <Navbar className="custom-navbar" variant="dark" fixed="top" expand="lg">
            <Container>
                {/* Brand Logo */}
                <Navbar.Brand as={Link} to="/">
                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.4rem' }}>
                        💼 JobPortal
                    </span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar-nav" />

                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto">
                        {/* Always visible */}
                        <Nav.Link as={Link} to="/" style={{ color: '#fff' }}>
                            Browse Jobs
                        </Nav.Link>

                        {/* Only for employers */}
                        {user?.role === 'employer' && (
                            <Nav.Link
                                as={Link}
                                to="/employer-dashboard"
                                style={{ color: '#fff' }}
                            >
                                My Dashboard
                            </Nav.Link>
                        )}

                        {/* Only for job seekers */}
                        {user?.role === 'job_seeker' && (
                            <Nav.Link
                                as={Link}
                                to="/jobseeker-dashboard"
                                style={{ color: '#fff' }}
                            >
                                My Applications
                            </Nav.Link>
                        )}
                    </Nav>

                    <Nav className="align-items-center gap-2">
                        {/* Dark/Light mode toggle */}
                        <Button
                            variant="outline-light"
                            size="sm"
                            onClick={toggleTheme}
                            style={{ borderRadius: '50px' }}
                        >
                            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                        </Button>

                        {/* Show login/register if not logged in */}
                        {!user ? (
                            <>
                                <Nav.Link
                                    as={Link}
                                    to="/login"
                                    style={{ color: '#fff' }}
                                >
                                    Login
                                </Nav.Link>
                                <Button
                                    as={Link}
                                    to="/register"
                                    variant="light"
                                    size="sm"
                                    style={{ borderRadius: '50px' }}
                                >
                                    Register
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* Show user email */}
                                <span style={{ color: '#fff', fontSize: '0.9rem' }}>
                                    👤 {user.username}
                                </span>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    style={{ borderRadius: '50px' }}
                                >
                                    {loggingOut ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Logging out...
                                        </>
                                    ) : 'Logout'}
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;