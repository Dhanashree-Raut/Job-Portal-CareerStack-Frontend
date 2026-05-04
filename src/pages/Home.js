import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
    const navigate = useNavigate();

    // State
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter state
    const [search, setSearch] = useState('');
    const [jobType, setJobType] = useState('');
    const [location, setLocation] = useState('');

    // Fetch jobs when component loads or filters change
    useEffect(() => {
        fetchJobs();
    }, [search, jobType, location]);

    // How this works:
    // useEffect watches [search, jobType, location]
    // Any time these change → fetchJobs() runs again
    // This gives us live filtering without a search button

    const fetchJobs = async () => {
        try {
            setLoading(true);

            // Build query params based on filters
            const params = {};
            if (search) params.search = search;
            if (jobType) params.job_type = jobType;
            if (location) params.location = location;

            const response = await api.get('/api/jobs/', { params });
            setJobs(response.data);
        } catch (err) {
            setError('Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Format salary display
    const formatSalary = (min, max) => {
        if (!min && !max) return 'Salary not specified';
        if (min && max) return `₹${Number(min).toLocaleString()} - ₹${Number(max).toLocaleString()}`;
        if (min) return `From ₹${Number(min).toLocaleString()}`;
        return `Up to ₹${Number(max).toLocaleString()}`;
    };

    // Color for job type badge
    const getJobTypeBadge = (type) => {
        const colors = {
            full_time: 'primary',
            part_time: 'warning',
            contract: 'info',
            internship: 'success',
            remote: 'secondary'
        };
        return colors[type] || 'primary';
    };

    // Format job type label
    const formatJobType = (type) => {
        return type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="page-container">
            {/* Hero Section */}
            <div className="hero-section">
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col md={8}>
                            <h1 style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
                                Find Your Dream Job 🚀
                            </h1>
                            <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                                Thousands of jobs from top companies waiting for you
                            </p>

                            {/* Search Bar */}
                            <InputGroup className="mt-4" size="lg">
                                <Form.Control
                                    placeholder="Search jobs, skills, companies..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ borderRadius: '50px 0 0 50px' }}
                                />
                                <Button
                                    style={{
                                        background: 'white',
                                        color: '#6f42c1',
                                        border: 'none',
                                        borderRadius: '0 50px 50px 0',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    🔍 Search
                                </Button>
                            </InputGroup>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="mt-4">
                {/* Stats Row */}
                <Row className="mb-4 text-center">
                    <Col md={4}>
                        <h3 style={{ color: '#6f42c1', fontWeight: 'bold' }}>
                            {jobs.length}+
                        </h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Active Jobs</p>
                    </Col>
                    <Col md={4}>
                        <h3 style={{ color: '#6f42c1', fontWeight: 'bold' }}>500+</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Companies</p>
                    </Col>
                    <Col md={4}>
                        <h3 style={{ color: '#6f42c1', fontWeight: 'bold' }}>10k+</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Job Seekers</p>
                    </Col>
                </Row>

                {/* Filters Row */}
                <Row className="mb-4">
                    <Col md={6}>
                        <Form.Select
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            className="custom-input"
                        >
                            <option value="">All Job Types</option>
                            <option value="full_time">Full Time</option>
                            <option value="part_time">Part Time</option>
                            <option value="contract">Contract</option>
                            <option value="internship">Internship</option>
                            <option value="remote">Remote</option>
                        </Form.Select>
                    </Col>
                    <Col md={6}>
                        <Form.Control
                            placeholder="Filter by location..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="custom-input"
                        />
                    </Col>
                </Row>

                {/* Results count */}
                <div className="mb-3">
                    <span style={{ color: 'var(--text-secondary)' }}>
                        {loading ? 'Loading...' : `${jobs.length} jobs found`}
                    </span>
                </div>

                {/* Error */}
                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                {/* Loading */}
                {loading ? (
                    <Row>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Col md={4} key={i} className="mb-4">
                                <Card className="custom-card p-3">
                                    <div className="placeholder-glow">
                                        <span className="placeholder col-8 mb-2"></span>
                                        <span className="placeholder col-6 mb-2"></span>
                                        <span className="placeholder col-4"></span>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <>
                        {/* Job Cards */}
                        {jobs.length === 0 ? (
                            <div className="text-center py-5">
                                <h4 style={{ color: 'var(--text-secondary)' }}>
                                    😔 No jobs found
                                </h4>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    Try different search terms or filters
                                </p>
                            </div>
                        ) : (
                            <Row>
                                {jobs.map(job => (
                                    <Col md={4} key={job.id} className="mb-4">
                                        <Card
                                            className="custom-card h-100"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/jobs/${job.id}`)}
                                        >
                                            <Card.Body className="p-4">
                                                {/* Company & Job Type */}
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <span style={{
                                                        color: 'var(--text-secondary)',
                                                        fontSize: '0.85rem'
                                                    }}>
                                                        🏢 {job.employer_details?.company_name || 'Company'}
                                                    </span>
                                                    <Badge bg={getJobTypeBadge(job.job_type)}>
                                                        {formatJobType(job.job_type)}
                                                    </Badge>
                                                </div>

                                                {/* Job Title */}
                                                <h5 style={{
                                                    color: 'var(--text-primary)',
                                                    fontWeight: 'bold',
                                                    marginBottom: '8px'
                                                }}>
                                                    {job.title}
                                                </h5>

                                                {/* Location */}
                                                <p style={{
                                                    color: 'var(--text-secondary)',
                                                    fontSize: '0.9rem',
                                                    marginBottom: '8px'
                                                }}>
                                                    📍 {job.location}
                                                </p>

                                                {/* Salary */}
                                                <p style={{
                                                    color: '#6f42c1',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.9rem',
                                                    marginBottom: '12px'
                                                }}>
                                                    💰 {formatSalary(job.salary_min, job.salary_max)}
                                                </p>

                                                {/* Skills */}
                                                <div className="mb-3">
                                                    {job.skills_required
                                                        ?.split(',')
                                                        .slice(0, 3)
                                                        .map((skill, i) => (
                                                            <Badge
                                                                key={i}
                                                                bg="light"
                                                                text="dark"
                                                                className="me-1 mb-1"
                                                                style={{
                                                                    border: '1px solid var(--border-color)'
                                                                }}
                                                            >
                                                                {skill.trim()}
                                                            </Badge>
                                                        ))
                                                    }
                                                </div>

                                                {/* Footer */}
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span style={{
                                                        color: 'var(--text-secondary)',
                                                        fontSize: '0.8rem'
                                                    }}>
                                                        👥 {job.total_applications} applicants
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                                                            border: 'none',
                                                            borderRadius: '50px'
                                                        }}
                                                    >
                                                        View Job →
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
};

export default Home;