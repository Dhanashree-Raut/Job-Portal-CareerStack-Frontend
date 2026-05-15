import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Alert, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
    const { id } = useParams(); // Get job ID from URL
    const { user } = useAuth();
    const navigate = useNavigate();

    // State
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Application state
    const [showModal, setShowModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [applying, setApplying] = useState(false);
    const [applyError, setApplyError] = useState('');
    const [applySuccess, setApplySuccess] = useState(false);

    // Track if already applied (checked from server on load)
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    // Fetch job + applied status together — loader stays until BOTH finish
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchAll();
    }, [id, user]);

    const fetchAll = async () => {
        try {
            setLoading(true);

            // Run both requests in parallel
            const requests = [api.get(`/api/jobs/${id}/`)];
            if (user?.role === 'job_seeker') {
                requests.push(api.get('/api/jobs/my-applications/'));
            }

            const [jobRes, appsRes] = await Promise.all(requests);

            setJob(jobRes.data);

            if (appsRes) {
                const applied = appsRes.data.some(app => app.job === parseInt(id));
                setAlreadyApplied(applied);
            }
        } catch (err) {
            setError('Job not found or no longer available.');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        setApplying(true);
        setApplyError('');

        try {
            await api.post(`/api/jobs/${id}/apply/`, {
                cover_letter: coverLetter
            });
            setApplySuccess(true);
            setAlreadyApplied(true); // Update state immediately
            setShowModal(false);

        } catch (err) {
            const data = err.response?.data;
            if (data) {
                const messages = Object.values(data).flat().join(' ');
                setApplyError(messages);
            } else {
                setApplyError('Failed to apply. Please try again.');
            }
        } finally {
            setApplying(false);
        }
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Not specified';
        if (min && max) return `₹${Number(min).toLocaleString()} - ₹${Number(max).toLocaleString()}`;
        if (min) return `From ₹${Number(min).toLocaleString()}`;
        return `Up to ₹${Number(max).toLocaleString()}`;
    };

    const formatJobType = (type) => {
        return type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) return (
        <div className="page-container text-center pt-5">
            <div className="spinner-border" style={{ color: '#6f42c1' }}></div>
            <p style={{ color: 'var(--text-secondary)' }} className="mt-3">
                Loading job details...
            </p>
        </div>
    );

    if (error) return (
        <div className="page-container text-center pt-5">
            <h4 style={{ color: 'var(--text-secondary)' }}>😔 {error}</h4>
            <Button
                onClick={() => navigate('/')}
                style={{
                    background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                    border: 'none',
                    borderRadius: '50px',
                    marginTop: '20px'
                }}
            >
                Back to Jobs
            </Button>
        </div>
    );

    // Whether to show already-applied state
    const showAlreadyApplied = alreadyApplied || applySuccess;

    return (
        <div className="page-container">
            <Container className="py-4">
                {/* Back Button */}
                <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/')}
                    className="mb-4"
                    style={{ borderRadius: '50px' }}
                >
                    ← Back to Jobs
                </Button>

                {/* Success Alert */}
                {applySuccess && (
                    <Alert variant="success" className="rounded-3 mb-4">
                        🎉 Application submitted successfully! Good luck!
                    </Alert>
                )}

                {/* Already Applied Alert — shown when user visits a job they previously applied to */}
                {alreadyApplied && !applySuccess && (
                    <Alert variant="info" className="rounded-3 mb-4">
                        ✅ You have already applied to this job. We'll notify you of any updates!
                    </Alert>
                )}

                <Row>
                    {/* Main Job Details */}
                    <Col md={8}>
                        <Card className="custom-card p-4 mb-4">
                            <Card.Body>
                                {/* Header */}
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h2 style={{
                                            color: 'var(--text-primary)',
                                            fontWeight: 'bold'
                                        }}>
                                            {job.title}
                                        </h2>
                                        <p style={{ color: 'var(--text-secondary)' }}>
                                            🏢 {job.employer_details?.company_name}
                                        </p>
                                    </div>
                                    <div className="d-flex flex-column align-items-end gap-2">
                                        <Badge
                                            bg="primary"
                                            style={{ fontSize: '0.9rem', padding: '8px 12px' }}
                                        >
                                            {formatJobType(job.job_type)}
                                        </Badge>
                                        {/* Applied badge next to job type */}
                                        {showAlreadyApplied && (
                                            <Badge
                                                style={{
                                                    background: '#198754',
                                                    fontSize: '0.85rem',
                                                    padding: '8px 12px'
                                                }}
                                            >
                                                ✅ Applied
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Info */}
                                <Row className="mb-4">
                                    <Col md={4}>
                                        <div className="text-center p-3"
                                            style={{
                                                background: 'var(--bg-secondary)',
                                                borderRadius: '10px'
                                            }}
                                        >
                                            <div style={{ fontSize: '1.5rem' }}>📍</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                                Location
                                            </div>
                                            <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                                                {job.location}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="text-center p-3"
                                            style={{
                                                background: 'var(--bg-secondary)',
                                                borderRadius: '10px'
                                            }}
                                        >
                                            <div style={{ fontSize: '1.5rem' }}>💰</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                                Salary
                                            </div>
                                            <div style={{ color: '#6f42c1', fontWeight: 'bold' }}>
                                                {formatSalary(job.salary_min, job.salary_max)}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="text-center p-3"
                                            style={{
                                                background: 'var(--bg-secondary)',
                                                borderRadius: '10px'
                                            }}
                                        >
                                            <div style={{ fontSize: '1.5rem' }}>📊</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                                Experience
                                            </div>
                                            <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                                                {job.experience_level?.replace(/\b\w/g, l => l.toUpperCase())}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                {/* Description */}
                                <h5 style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                                    About the Role
                                </h5>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                    {job.description}
                                </p>

                                {/* Requirements */}
                                <h5 style={{ color: 'var(--text-primary)', fontWeight: 'bold', marginTop: '20px' }}>
                                    Requirements
                                </h5>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                    {job.requirements}
                                </p>

                                {/* Skills */}
                                <h5 style={{ color: 'var(--text-primary)', fontWeight: 'bold', marginTop: '20px' }}>
                                    Skills Required
                                </h5>
                                <div>
                                    {job.skills_required?.split(',').map((skill, i) => (
                                        <Badge
                                            key={i}
                                            className="me-2 mb-2"
                                            style={{
                                                background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                                                padding: '8px 12px',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {skill.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Sidebar */}
                    <Col md={4}>
                        {/* Apply Card */}
                        <Card className="custom-card p-4 mb-4">
                            <Card.Body>
                                <h5 style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                                    {showAlreadyApplied ? 'Application Status' : 'Ready to Apply?'}
                                </h5>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    👥 {job.total_applications} people have applied
                                </p>

                                {/* Deadline */}
                                {job.deadline && (
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        ⏰ Deadline: {new Date(job.deadline).toLocaleDateString()}
                                    </p>
                                )}

                                {/* Apply button logic */}
                                {!user ? (
                                    // Not logged in
                                    <Button
                                        onClick={() => navigate('/login')}
                                        style={{
                                            width: '100%',
                                            background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                                            border: 'none',
                                            borderRadius: '50px'
                                        }}
                                    >
                                        Login to Apply
                                    </Button>
                                ) : user.role === 'job_seeker' ? (
                                    showAlreadyApplied ? (
                                        // Already applied — show green disabled button
                                        <Button
                                            disabled
                                            style={{
                                                width: '100%',
                                                borderRadius: '50px',
                                                background: '#198754',
                                                border: 'none',
                                                opacity: 1,
                                                cursor: 'default'
                                            }}
                                        >
                                            ✅ Already Applied
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => setShowModal(true)}
                                            style={{
                                                width: '100%',
                                                background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                                                border: 'none',
                                                borderRadius: '50px'
                                            }}
                                        >
                                            Apply Now 🚀
                                        </Button>
                                    )
                                ) : (
                                    // Employer
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        Employers cannot apply to jobs.
                                    </p>
                                )}
                            </Card.Body>
                        </Card>

                        {/* Company Card */}
                        <Card className="custom-card p-4">
                            <Card.Body>
                                <h5 style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                                    About the Company
                                </h5>
                                <p style={{ color: '#6f42c1', fontWeight: 'bold' }}>
                                    🏢 {job.employer_details?.company_name}
                                </p>
                                {job.employer_details?.company_website && (
                                    <a href={job.employer_details.company_website}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ color: '#6f42c1' }}
                                    >
                                        🌐 Visit Website
                                    </a>
                                )}
                                {job.employer_details?.company_description && (
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.9rem',
                                        marginTop: '10px'
                                    }}>
                                        {job.employer_details.company_description}
                                    </p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Apply Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header
                    closeButton
                    style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border-color)'
                    }}
                >
                    <Modal.Title style={{ color: 'var(--text-primary)' }}>
                        Apply for {job?.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: 'var(--bg-card)' }}>
                    {applyError && (
                        <Alert variant="danger">{applyError}</Alert>
                    )}
                    <Form.Group>
                        <Form.Label style={{ color: 'var(--text-primary)' }}>
                            Cover Letter
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Tell the employer why you're the perfect fit..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            className="custom-input"
                        />
                        <Form.Text style={{ color: 'var(--text-secondary)' }}>
                            A good cover letter increases your chances significantly!
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer
                    style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border-color)'
                    }}
                >
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowModal(false)}
                        style={{ borderRadius: '50px' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApply}
                        disabled={applying}
                        style={{
                            background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                            border: 'none',
                            borderRadius: '50px'
                        }}
                    >
                        {applying ? 'Submitting...' : 'Submit Application 🚀'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default JobDetail;