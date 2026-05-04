import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetail from './pages/JobDetail';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import { useAuth } from './context/AuthContext';

// Protected Route — only logged in users can access
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useAuth();

    // Still checking if user is logged in
    if (loading) return <div className="text-center mt-5">Loading...</div>;

    // Not logged in → redirect to login
    if (!user) return <Navigate to="/login" />;

    // Wrong role → redirect to home
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <AppNavbar />
            <Routes>
                {/* Public routes — anyone can access */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/jobs/:id" element={<JobDetail />} />

                {/* Protected — job seekers only */}
                <Route
                    path="/jobseeker-dashboard"
                    element={
                        <ProtectedRoute allowedRole="job_seeker">
                            <JobSeekerDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Protected — employers only */}
                <Route
                    path="/employer-dashboard"
                    element={
                        <ProtectedRoute allowedRole="employer">
                            <EmployerDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Catch all — redirect to home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;