import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const JobSeekerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/jobs/my-applications/');
            setApplications(response.data);
        } catch (err) {
            setError('Failed to load applications.');
        } finally {
            setLoading(false);
        }
    };

    // Status badge styling
    const getStatusStyle = (status) => {
        const styles = {
            pending:     { bg: '#ffc107', color: '#000', label: '⏳ Pending' },
            reviewed:    { bg: '#0dcaf0', color: '#000', label: '👀 Reviewed' },
            shortlisted: { bg: '#198754', color: '#fff', label: '⭐ Shortlisted' },
            rejected:    { bg: '#dc3545', color: '#fff', label: '❌ Rejected' },
            accepted:    { bg: '#6f42c1', color: '#fff', label: '🎉 Accepted' },
        };
        return styles[status] || { bg: '#6c757d', color: '#fff', label: status };
    };

    // Stats calculation
    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length,
        accepted: applications.filter(a => a.status === 'accepted').length,
    };

    return (
        <div className="page-container">
            <Container className="py-4">
                {/* Header */}
                <div className="mb-4">
                    <h2 style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                        👋 Welcome, {user?.username}!
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Track all your job applications here
                    </p>
                </div>

                {/* Stats Cards */}
                <Row className="mb-4">
                    {[
                        { label: 'Total Applied', value: stats.total, icon: '📋', color: '#6f42c1' },
                        { label: 'Pending', value: stats.pending, icon: '⏳', color: '#ffc107' },
                        { label: 'Shortlisted', value: stats.shortlisted, icon: '⭐', color: '#198754' },
                        { label: 'Accepted', value: stats.accepted, icon: '🎉', color: '#0d6efd' },
                    ].map((stat, i) => (
                        <Col md={3} key={i} className="mb-3">
                            <Card className="custom-card p-3 text-center">
                                <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
                                <h3 style={{ color: stat.color, fontWeight: 'bold' }}>
                                    {stat.value}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                                    {stat.label}
                                </p>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Browse Jobs Button */}
                <div className="mb-4">
                    <Button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                            border: 'none',
                            borderRadius: '50px',
                            padding: '10px 25px'
                        }}
                    >
                        🔍 Browse More Jobs
                    </Button>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                {/* Applications List */}
                <h4 style={{ color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '20px' }}>
                    My Applications
                </h4>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: '#6f42c1' }}></div>
                    </div>
                ) : applications.length === 0 ? (
                    <Card className="custom-card p-5 text-center">
                        <h5 style={{ color: 'var(--text-secondary)' }}>
                            😔 No applications yet
                        </h5>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Start applying to jobs to track them here
                        </p>
                        <Button
                            onClick={() => navigate('/')}
                            style={{
                                background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                                border: 'none',
                                borderRadius: '50px'
                            }}
                        >
                            Browse Jobs
                        </Button>
                    </Card>
                ) : (
                    <Row>
                        {applications.map(app => {
                            const statusStyle = getStatusStyle(app.status);
                            return (
                                <Col md={6} key={app.id} className="mb-4">
                                    <Card className="custom-card p-4 h-100">
                                        <Card.Body>
                                            {/* Job Title + Status */}
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <h5 style={{
                                                    color: 'var(--text-primary)',
                                                    fontWeight: 'bold',
                                                    margin: 0
                                                }}>
                                                    {app.job_details?.title}
                                                </h5>
                                                <Badge style={{
                                                    background: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    padding: '6px 12px',
                                                    fontSize: '0.8rem'
                                                }}>
                                                    {statusStyle.label}
                                                </Badge>
                                            </div>

                                            {/* Company */}
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                🏢 {app.job_details?.employer_details?.company_name}
                                            </p>

                                            {/* Location */}
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                📍 {app.job_details?.location}
                                            </p>

                                            {/* Applied date */}
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                📅 Applied: {new Date(app.applied_at).toLocaleDateString()}
                                            </p>

                                            {/* Employer note if exists */}
                                            {app.employer_note && (
                                                <div style={{
                                                    background: 'var(--bg-secondary)',
                                                    borderRadius: '8px',
                                                    padding: '10px',
                                                    marginTop: '10px',
                                                    borderLeft: '3px solid #6f42c1'
                                                }}>
                                                    <p style={{
                                                        color: 'var(--text-secondary)',
                                                        fontSize: '0.85rem',
                                                        margin: 0
                                                    }}>
                                                        💬 <strong>Employer note:</strong> {app.employer_note}
                                                    </p>
                                                </div>
                                            )}

                                            {/* View Job Button */}
                                            <Button
                                                size="sm"
                                                onClick={() => navigate(`/jobs/${app.job_details?.id}`)}
                                                style={{
                                                    background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                                                    border: 'none',
                                                    borderRadius: '50px',
                                                    marginTop: '15px'
                                                }}
                                            >
                                                View Job →
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default JobSeekerDashboard;