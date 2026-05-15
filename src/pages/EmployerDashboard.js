import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Alert, Modal } from 'react-bootstrap';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EMPTY_JOB_FORM = {
    title: '', description: '', requirements: '',
    location: '', salary_min: '', salary_max: '',
    job_type: 'full_time', experience_level: 'entry',
    skills_required: '', status: 'active', deadline: ''
};

// ─────────────────────────────────────────────────────────
// Defined OUTSIDE EmployerDashboard so React doesn't
// recreate it on every render (inputs losing focus fix)
// ─────────────────────────────────────────────────────────
const JobFormFields = ({ form, onChange }) => (
    <>
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'var(--text-primary)' }}>Job Title *</Form.Label>
                    <Form.Control
                        name="title" placeholder="e.g. Django Developer"
                        value={form.title} onChange={onChange}
                        className="custom-input" required
                    />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'var(--text-primary)' }}>Location *</Form.Label>
                    <Form.Control
                        name="location" placeholder="e.g. Mumbai"
                        value={form.location} onChange={onChange}
                        className="custom-input" required
                    />
                </Form.Group>
            </Col>
        </Row>
        <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--text-primary)' }}>Job Description *</Form.Label>
            <Form.Control
                as="textarea" rows={3} name="description"
                placeholder="Describe the role..."
                value={form.description} onChange={onChange}
                className="custom-input" required
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--text-primary)' }}>Requirements *</Form.Label>
            <Form.Control
                as="textarea" rows={3} name="requirements"
                placeholder="List requirements..."
                value={form.requirements} onChange={onChange}
                className="custom-input" required
            />
        </Form.Group>
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'var(--text-primary)' }}>Job Type</Form.Label>
                    <Form.Select name="job_type" value={form.job_type} onChange={onChange} className="custom-input">
                        <option value="full_time">Full Time</option>
                        <option value="part_time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                        <option value="remote">Remote</option>
                    </Form.Select>
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'var(--text-primary)' }}>Experience Level</Form.Label>
                    <Form.Select name="experience_level" value={form.experience_level} onChange={onChange} className="custom-input">
                        <option value="entry">Entry Level</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior Level</option>
                    </Form.Select>
                </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'var(--text-primary)' }}>Min Salary (₹)</Form.Label>
                    <Form.Control
                        type="number" name="salary_min" placeholder="e.g. 500000"
                        value={form.salary_min} onChange={onChange} className="custom-input"
                    />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'var(--text-primary)' }}>Max Salary (₹)</Form.Label>
                    <Form.Control
                        type="number" name="salary_max" placeholder="e.g. 800000"
                        value={form.salary_max} onChange={onChange} className="custom-input"
                    />
                </Form.Group>
            </Col>
        </Row>
        <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--text-primary)' }}>Skills Required</Form.Label>
            <Form.Control
                name="skills_required" placeholder="e.g. Python, Django, React"
                value={form.skills_required} onChange={onChange}
                className="custom-input" required
            />
        </Form.Group>
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'var(--text-primary)' }}>Application Deadline</Form.Label>
                    <Form.Control
                        type="date" name="deadline"
                        value={form.deadline} onChange={onChange} className="custom-input"
                    />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'var(--text-primary)' }}>Status</Form.Label>
                    <Form.Select name="status" value={form.status} onChange={onChange} className="custom-input">
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="closed">Closed</option>
                    </Form.Select>
                </Form.Group>
            </Col>
        </Row>
    </>
);

// ─────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────
const EmployerDashboard = () => {
    const { user } = useAuth();

    // Jobs state
    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);

    // Applications state
    const [applications, setApplications] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loadingApps, setLoadingApps] = useState(false);

    // Post job modal
    const [showJobModal, setShowJobModal] = useState(false);
    const [jobForm, setJobForm] = useState(EMPTY_JOB_FORM);
    const [posting, setPosting] = useState(false);
    const [postError, setPostError] = useState('');
    const [postSuccess, setPostSuccess] = useState('');

    // Edit job modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [editForm, setEditForm] = useState(EMPTY_JOB_FORM);
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState('');

    // Status update modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [employerNote, setEmployerNote] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Company profile modal
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [companyForm, setCompanyForm] = useState({
        company_name: '',
        company_website: '',
        company_description: '',
    });
    const [savingCompany, setSavingCompany] = useState(false);
    const [companySuccess, setCompanySuccess] = useState('');
    const [companyError, setCompanyError] = useState('');

    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyJobs();
        fetchCompanyProfile();
    }, []);

    const fetchMyJobs = async () => {
        try {
            setLoadingJobs(true);
            const response = await api.get('/api/jobs/my-jobs/');
            setJobs(response.data);
        } catch (err) {
            setError('Failed to load jobs.');
        } finally {
            setLoadingJobs(false);
        }
    };

    const fetchCompanyProfile = async () => {
        try {
            const response = await api.get('/api/accounts/profile/');
            const { company_name, company_website, company_description } = response.data;
            setCompanyForm({
                company_name: company_name || '',
                company_website: company_website || '',
                company_description: company_description || '',
            });
        } catch (err) {
            // silently fail
        }
    };

    const fetchApplications = async (jobId) => {
        try {
            setLoadingApps(true);
            setSelectedJob(jobId);
            const response = await api.get(`/api/jobs/${jobId}/applications/`);
            setApplications(response.data);
        } catch (err) {
            setError('Failed to load applications.');
        } finally {
            setLoadingApps(false);
        }
    };

    // ── POST NEW JOB ──
    const handleJobFormChange = (e) => {
        setJobForm({ ...jobForm, [e.target.name]: e.target.value });
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        setPosting(true);
        setPostError('');
        try {
            await api.post('/api/jobs/', jobForm);
            setPostSuccess('Job posted successfully!');
            setShowJobModal(false);
            setJobForm(EMPTY_JOB_FORM);
            fetchMyJobs();
        } catch (err) {
            const data = err.response?.data;
            setPostError(data ? Object.values(data).flat().join(' ') : 'Failed to post job.');
        } finally {
            setPosting(false);
        }
    };

    // ── EDIT JOB ──
    const openEditModal = (e, job) => {
        e.stopPropagation();
        setEditingJob(job);
        setEditForm({
            title: job.title || '',
            description: job.description || '',
            requirements: job.requirements || '',
            location: job.location || '',
            salary_min: job.salary_min || '',
            salary_max: job.salary_max || '',
            job_type: job.job_type || 'full_time',
            experience_level: job.experience_level || 'entry',
            skills_required: job.skills_required || '',
            status: job.status || 'active',
            deadline: job.deadline || '',
        });
        setEditError('');
        setShowEditModal(true);
    };

    const handleEditFormChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setEditError('');
        try {
            await api.put(`/api/jobs/${editingJob.id}/`, editForm);
            setPostSuccess('Job updated successfully!');
            setShowEditModal(false);
            setEditingJob(null);
            fetchMyJobs();
        } catch (err) {
            const data = err.response?.data;
            setEditError(data ? Object.values(data).flat().join(' ') : 'Failed to update job.');
        } finally {
            setSaving(false);
        }
    };

    // ── UPDATE APPLICATION STATUS ──
    const handleUpdateStatus = async () => {
        setUpdatingStatus(true);
        try {
            await api.put(
                `/api/jobs/applications/${selectedApp.id}/status/`,
                { status: newStatus, employer_note: employerNote }
            );
            setApplications(prev =>
                prev.map(app =>
                    app.id === selectedApp.id
                        ? { ...app, status: newStatus, employer_note: employerNote }
                        : app
                )
            );
            setShowStatusModal(false);
            setEmployerNote('');
        } catch (err) {
            setError('Failed to update status.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    // ── COMPANY PROFILE ──
    const handleCompanyFormChange = (e) => {
        setCompanyForm({ ...companyForm, [e.target.name]: e.target.value });
    };

    const handleSaveCompany = async (e) => {
        e.preventDefault();
        setSavingCompany(true);
        setCompanyError('');
        setCompanySuccess('');
        try {
            await api.patch('/api/accounts/profile/', companyForm);
            setCompanySuccess('Company profile updated successfully!');
        } catch (err) {
            const data = err.response?.data;
            setCompanyError(data ? Object.values(data).flat().join(' ') : 'Failed to update profile.');
        } finally {
            setSavingCompany(false);
        }
    };

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

    const stats = {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(j => j.status === 'active').length,
        totalApplications: jobs.reduce((sum, j) => sum + j.total_applications, 0),
    };

    return (
        <div className="page-container">
            <Container className="py-4">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                            🏢 {user?.username}'s Dashboard
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Manage your job postings and applications
                        </p>
                    </div>
                    {/* Two buttons side by side */}
                    <div className="d-flex gap-2">
                        <Button
                            onClick={() => {
                                setCompanySuccess('');
                                setCompanyError('');
                                setShowProfileModal(true);
                            }}
                            style={{
                                background: 'transparent',
                                border: '2px solid #6f42c1',
                                color: '#6f42c1',
                                borderRadius: '50px',
                                padding: '10px 20px',
                                fontWeight: 'bold'
                            }}
                        >
                            ✏️ Edit Profile
                        </Button>
                        <Button
                            onClick={() => setShowJobModal(true)}
                            style={{
                                background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                                border: 'none', borderRadius: '50px', padding: '10px 25px',
                                fontWeight: 'bold'
                            }}
                        >
                            + Post New Job
                        </Button>
                    </div>
                </div>

                {postSuccess && (
                    <Alert variant="success" onClose={() => setPostSuccess('')} dismissible className="rounded-3">
                        🎉 {postSuccess}
                    </Alert>
                )}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Stats */}
                <Row className="mb-4">
                    {[
                        { label: 'Total Jobs', value: stats.totalJobs, icon: '📋', color: '#6f42c1' },
                        { label: 'Active Jobs', value: stats.activeJobs, icon: '✅', color: '#198754' },
                        { label: 'Total Applications', value: stats.totalApplications, icon: '👥', color: '#0d6efd' },
                    ].map((stat, i) => (
                        <Col md={4} key={i} className="mb-3">
                            <Card className="custom-card p-3 text-center">
                                <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
                                <h3 style={{ color: stat.color, fontWeight: 'bold' }}>{stat.value}</h3>
                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{stat.label}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row>
                    {/* Jobs List */}
                    <Col md={5}>
                        <h4 style={{ color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '20px' }}>
                            My Job Postings
                        </h4>
                        {loadingJobs ? (
                            <div className="text-center py-4">
                                <div className="spinner-border" style={{ color: '#6f42c1' }}></div>
                            </div>
                        ) : jobs.length === 0 ? (
                            <Card className="custom-card p-4 text-center">
                                <p style={{ color: 'var(--text-secondary)' }}>No jobs posted yet</p>
                                <Button
                                    onClick={() => setShowJobModal(true)}
                                    style={{
                                        background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                                        border: 'none', borderRadius: '50px'
                                    }}
                                >
                                    Post Your First Job
                                </Button>
                            </Card>
                        ) : (
                            jobs.map(job => (
                                <Card
                                    key={job.id}
                                    className="custom-card p-3 mb-3"
                                    style={{
                                        cursor: 'pointer',
                                        border: selectedJob === job.id
                                            ? '2px solid #6f42c1'
                                            : '1px solid var(--border-color)'
                                    }}
                                    onClick={() => fetchApplications(job.id)}
                                >
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h6 style={{ color: 'var(--text-primary)', fontWeight: 'bold', margin: 0 }}>
                                                {job.title}
                                            </h6>
                                            <small style={{ color: 'var(--text-secondary)' }}>
                                                📍 {job.location}
                                            </small>
                                        </div>
                                        <div className="text-end d-flex flex-column align-items-end gap-1">
                                            <Badge bg={job.status === 'active' ? 'success' : 'secondary'}>
                                                {job.status}
                                            </Badge>
                                            <small style={{ color: 'var(--text-secondary)' }}>
                                                👥 {job.total_applications} apps
                                            </small>
                                            <Button
                                                size="sm"
                                                onClick={(e) => openEditModal(e, job)}
                                                style={{
                                                    background: 'transparent',
                                                    border: '1px solid #6f42c1',
                                                    color: '#6f42c1',
                                                    borderRadius: '50px',
                                                    fontSize: '0.75rem',
                                                    padding: '2px 10px',
                                                }}
                                            >
                                                ✏️ Edit
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </Col>

                    {/* Applications List */}
                    <Col md={7}>
                        <h4 style={{ color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '20px' }}>
                            {selectedJob ? 'Applications' : 'Select a job to view applications'}
                        </h4>
                        {!selectedJob ? (
                            <Card className="custom-card p-5 text-center">
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    👈 Click on a job to see its applications
                                </p>
                            </Card>
                        ) : loadingApps ? (
                            <div className="text-center py-4">
                                <div className="spinner-border" style={{ color: '#6f42c1' }}></div>
                            </div>
                        ) : applications.length === 0 ? (
                            <Card className="custom-card p-4 text-center">
                                <p style={{ color: 'var(--text-secondary)' }}>No applications yet for this job</p>
                            </Card>
                        ) : (
                            applications.map(app => {
                                const statusStyle = getStatusStyle(app.status);
                                return (
                                    <Card key={app.id} className="custom-card p-4 mb-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h6 style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                                                    👤 {app.applicant_details?.username}
                                                </h6>
                                                <small style={{ color: 'var(--text-secondary)' }}>
                                                    📧 {app.applicant_details?.email}
                                                </small><br />
                                                <small style={{ color: 'var(--text-secondary)' }}>
                                                    🛠️ {app.applicant_details?.skills || 'No skills listed'}
                                                </small><br />
                                                <small style={{ color: 'var(--text-secondary)' }}>
                                                    📅 Applied: {new Date(app.applied_at).toLocaleDateString()}
                                                </small>
                                            </div>
                                            <Badge style={{
                                                background: statusStyle.bg,
                                                color: statusStyle.color,
                                                padding: '6px 12px'
                                            }}>
                                                {statusStyle.label}
                                            </Badge>
                                        </div>
                                        {app.cover_letter && (
                                            <div style={{
                                                background: 'var(--bg-secondary)',
                                                borderRadius: '8px',
                                                padding: '10px',
                                                marginTop: '10px'
                                            }}>
                                                <small style={{ color: 'var(--text-secondary)' }}>
                                                    💬 <strong>Cover Letter:</strong> {app.cover_letter}
                                                </small>
                                            </div>
                                        )}
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setSelectedApp(app);
                                                setNewStatus(app.status);
                                                setShowStatusModal(true);
                                            }}
                                            style={{
                                                background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                                                border: 'none', borderRadius: '50px', marginTop: '10px'
                                            }}
                                        >
                                            Update Status
                                        </Button>
                                    </Card>
                                );
                            })
                        )}
                    </Col>
                </Row>
            </Container>

            {/* ── COMPANY PROFILE MODAL ── */}
            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <Modal.Title style={{ color: 'var(--text-primary)' }}>
                        🏢 Edit Company Profile
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: 'var(--bg-card)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                        This information is shown to job seekers on every job you post.
                    </p>
                    {companySuccess && (
                        <Alert variant="success" onClose={() => setCompanySuccess('')} dismissible>
                            ✅ {companySuccess}
                        </Alert>
                    )}
                    {companyError && (
                        <Alert variant="danger" onClose={() => setCompanyError('')} dismissible>
                            {companyError}
                        </Alert>
                    )}
                    <Form onSubmit={handleSaveCompany}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ color: 'var(--text-primary)' }}>Company Name</Form.Label>
                                    <Form.Control
                                        name="company_name"
                                        placeholder="e.g. Infosys"
                                        value={companyForm.company_name}
                                        onChange={handleCompanyFormChange}
                                        className="custom-input"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ color: 'var(--text-primary)' }}>Company Website</Form.Label>
                                    <Form.Control
                                        name="company_website"
                                        placeholder="e.g. https://www.infosys.com"
                                        value={companyForm.company_website}
                                        onChange={handleCompanyFormChange}
                                        className="custom-input"
                                        type="url"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: 'var(--text-primary)' }}>Company Description</Form.Label>
                            <Form.Control
                                as="textarea" rows={4}
                                name="company_description"
                                placeholder="Tell job seekers about your company, culture, and what makes you unique..."
                                value={companyForm.company_description}
                                onChange={handleCompanyFormChange}
                                className="custom-input"
                            />
                        </Form.Group>
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowProfileModal(false)}
                                style={{ flex: 1, borderRadius: '50px', padding: '10px' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit" disabled={savingCompany}
                                style={{
                                    flex: 1,
                                    background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                                    border: 'none', borderRadius: '50px', padding: '10px'
                                }}
                            >
                                {savingCompany ? 'Saving...' : 'Save Profile ✅'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* ── POST NEW JOB MODAL ── */}
            <Modal show={showJobModal} onHide={() => setShowJobModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <Modal.Title style={{ color: 'var(--text-primary)' }}>Post a New Job</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: 'var(--bg-card)' }}>
                    {postError && <Alert variant="danger">{postError}</Alert>}
                    <Form onSubmit={handlePostJob}>
                        <JobFormFields form={jobForm} onChange={handleJobFormChange} />
                        <Button
                            type="submit" disabled={posting}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                                border: 'none', borderRadius: '50px', padding: '10px'
                            }}
                        >
                            {posting ? 'Posting...' : 'Post Job 🚀'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* ── EDIT JOB MODAL ── */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <Modal.Title style={{ color: 'var(--text-primary)' }}>
                        ✏️ Edit Job — {editingJob?.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: 'var(--bg-card)' }}>
                    {editError && <Alert variant="danger">{editError}</Alert>}
                    <Form onSubmit={handleSaveEdit}>
                        <JobFormFields form={editForm} onChange={handleEditFormChange} />
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowEditModal(false)}
                                style={{ flex: 1, borderRadius: '50px', padding: '10px' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit" disabled={saving}
                                style={{
                                    flex: 1,
                                    background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                                    border: 'none', borderRadius: '50px', padding: '10px'
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Changes ✅'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* ── UPDATE STATUS MODAL ── */}
            <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
                <Modal.Header closeButton style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <Modal.Title style={{ color: 'var(--text-primary)' }}>Update Application Status</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: 'var(--bg-card)' }}>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: 'var(--text-primary)' }}>Status</Form.Label>
                        <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="custom-input">
                            <option value="pending">⏳ Pending</option>
                            <option value="reviewed">👀 Reviewed</option>
                            <option value="shortlisted">⭐ Shortlisted</option>
                            <option value="rejected">❌ Rejected</option>
                            <option value="accepted">🎉 Accepted</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{ color: 'var(--text-primary)' }}>Note to Applicant (optional)</Form.Label>
                        <Form.Control
                            as="textarea" rows={3}
                            placeholder="Leave a message for the applicant..."
                            value={employerNote}
                            onChange={(e) => setEmployerNote(e.target.value)}
                            className="custom-input"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowStatusModal(false)}
                        style={{ borderRadius: '50px' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdateStatus} disabled={updatingStatus}
                        style={{
                            background: 'linear-gradient(135deg, #6f42c1, #0d6efd)',
                            border: 'none', borderRadius: '50px'
                        }}
                    >
                        {updatingStatus ? 'Updating...' : 'Update Status ✅'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EmployerDashboard;