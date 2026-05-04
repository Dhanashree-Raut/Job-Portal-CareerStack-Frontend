import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
    const { login } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    // Form state — stores what user types
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Runs every time user types in any field
    const handleChange = (e) => {
        setFormData({
            ...formData,           // keep existing values
            [e.target.name]: e.target.value  // update changed field
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit
        setLoading(true);
        setError('');

        try {
            const user = await login(formData.email, formData.password);

            // Redirect based on role after login
            if (user.role === 'employer') {
                navigate('/employer-dashboard');
            } else {
                navigate('/jobseeker-dashboard');
            }
        } catch (err) {
            // Show error message from Django
            setError(
                err.response?.data?.error ||
                'Login failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container d-flex align-items-center">
            <Container>
                <Row className="justify-content-center">
                    <Col md={5}>
                        <Card className="custom-card p-4">
                            <Card.Body>
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <h2 style={{ color: '#6f42c1', fontWeight: 'bold' }}>
                                        💼 Welcome Back
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        Sign in to your account
                                    </p>
                                </div>

                                {/* Error alert */}
                                {error && (
                                    <Alert variant="danger" className="rounded-3">
                                        {error}
                                    </Alert>
                                )}

                                {/* Login Form */}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--text-primary)' }}>
                                            Email Address
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="custom-input"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label style={{ color: 'var(--text-primary)' }}>
                                            Password
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="custom-input"
                                            required
                                        />
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            width: '100%',
                                            background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                                            border: 'none',
                                            borderRadius: '50px',
                                            padding: '10px'
                                        }}
                                    >
                                        {loading ? 'Signing in...' : 'Sign In'}
                                    </Button>
                                </Form>

                                {/* Register link */}
                                <div className="text-center mt-3">
                                    <span style={{ color: 'var(--text-secondary)' }}>
                                        Don't have an account?{' '}
                                    </span>
                                    <Link
                                        to="/register"
                                        style={{ color: '#6f42c1', fontWeight: 'bold' }}
                                    >
                                        Register here
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;