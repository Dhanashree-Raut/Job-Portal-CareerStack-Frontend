import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        password2: '',
        role: 'job_seeker',
        company_name: '',
        skills: '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic client side validation
        if (formData.password !== formData.password2) {
            setError('Passwords do not match!');
            setLoading(false);
            return;
        }

        try {
            const user = await register(formData);

            // Redirect based on role
            if (user.role === 'employer') {
                navigate('/employer-dashboard');
            } else {
                navigate('/jobseeker-dashboard');
            }
        } catch (err) {
            // Django returns errors as object
            // e.g. { email: ['already exists'] }
            const data = err.response?.data;
            if (data) {
                const messages = Object.values(data).flat().join(' ');
                setError(messages);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container d-flex align-items-center py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="custom-card p-4">
                            <Card.Body>
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <h2 style={{ color: '#6f42c1', fontWeight: 'bold' }}>
                                        💼 Create Account
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        Join thousands of job seekers and employers
                                    </p>
                                </div>

                                {error && (
                                    <Alert variant="danger" className="rounded-3">
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    {/* Role Selection */}
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                                            I am a:
                                        </Form.Label>
                                        <div className="d-flex gap-3">
                                            <Button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: 'job_seeker' })}
                                                style={{
                                                    flex: 1,
                                                    borderRadius: '50px',
                                                    background: formData.role === 'job_seeker'
                                                        ? 'linear-gradient(135deg, #6f42c1, #0d6efd)'
                                                        : 'transparent',
                                                    border: '2px solid #6f42c1',
                                                    color: formData.role === 'job_seeker' ? '#fff' : '#6f42c1'
                                                }}
                                            >
                                                👨‍💼 Job Seeker
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: 'employer' })}
                                                style={{
                                                    flex: 1,
                                                    borderRadius: '50px',
                                                    background: formData.role === 'employer'
                                                        ? 'linear-gradient(135deg, #6f42c1, #0d6efd)'
                                                        : 'transparent',
                                                    border: '2px solid #6f42c1',
                                                    color: formData.role === 'employer' ? '#fff' : '#6f42c1'
                                                }}
                                            >
                                                🏢 Employer
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    {/* Common Fields */}
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{ color: 'var(--text-primary)' }}>
                                                    Username
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="username"
                                                    placeholder="Choose a username"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    className="custom-input"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{ color: 'var(--text-primary)' }}>
                                                    Phone
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="phone"
                                                    placeholder="Your phone number"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="custom-input"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

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

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{ color: 'var(--text-primary)' }}>
                                                    Password
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    placeholder="Create password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="custom-input"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{ color: 'var(--text-primary)' }}>
                                                    Confirm Password
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="password2"
                                                    placeholder="Confirm password"
                                                    value={formData.password2}
                                                    onChange={handleChange}
                                                    className="custom-input"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Conditional fields based on role */}
                                    {formData.role === 'job_seeker' && (
                                        <Form.Group className="mb-3">
                                            <Form.Label style={{ color: 'var(--text-primary)' }}>
                                                Skills
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="skills"
                                                placeholder="e.g. Python, Django, React"
                                                value={formData.skills}
                                                onChange={handleChange}
                                                className="custom-input"
                                            />
                                            <Form.Text style={{ color: 'var(--text-secondary)' }}>
                                                Comma separated skills
                                            </Form.Text>
                                        </Form.Group>
                                    )}

                                    {formData.role === 'employer' && (
                                        <Form.Group className="mb-3">
                                            <Form.Label style={{ color: 'var(--text-primary)' }}>
                                                Company Name
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="company_name"
                                                placeholder="Your company name"
                                                value={formData.company_name}
                                                onChange={handleChange}
                                                className="custom-input"
                                                required
                                            />
                                        </Form.Group>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            width: '100%',
                                            background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                                            border: 'none',
                                            borderRadius: '50px',
                                            padding: '10px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </Button>
                                </Form>

                                <div className="text-center mt-3">
                                    <span style={{ color: 'var(--text-secondary)' }}>
                                        Already have an account?{' '}
                                    </span>
                                    <Link
                                        to="/login"
                                        style={{ color: '#6f42c1', fontWeight: 'bold' }}
                                    >
                                        Login here
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

export default Register;