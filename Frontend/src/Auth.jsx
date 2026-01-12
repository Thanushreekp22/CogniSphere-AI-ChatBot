import { useState } from 'react';
import './Auth.css';

function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            setLoading(false);
            return;
        }

        if (!isLogin && !formData.name) {
            setError('Name is required for signup');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        try {
            if (isLogin) {
                // Login API call
                const response = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Store JWT tokens
                    sessionStorage.setItem('accessToken', data.accessToken);
                    sessionStorage.setItem('refreshToken', data.refreshToken);
                    // Login successful
                    onLogin(data.user);
                } else {
                    setError(data.error || 'Login failed');
                }
            } else {
                // Register API call
                const response = await fetch(`${API_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Registration successful - redirect to login
                    setSuccess('Account created successfully! Please login.');
                    setFormData({ email: formData.email, password: '', name: '' });
                    setIsLogin(true);
                } else {
                    setError(data.error || 'Registration failed');
                }
            }
        } catch (error) {
            console.error('Auth error:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGuestAccess = () => {
        // Create a unique guest user with timestamp and random number
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const guestUser = {
            name: 'Guest User',
            email: `${guestId}@cognisphere.ai`,
            isGuest: true,
            guestId: guestId
        };
        onLogin(guestUser);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <img src="/cognisphere-logo.png" alt="CogniSphere" className="auth-logo" />
                    <h1 className="auth-title">
                        CogniSphere
                    </h1>
                    <p className="auth-subtitle">
                        {isLogin ? 'Welcome back!' : 'Create your account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="auth-input"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="auth-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="auth-input"
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}
                    {success && <div className="auth-success">{success}</div>}

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                {isLogin && (
                    <div className="guest-access">
                        <div className="divider">
                            <span>or</span>
                        </div>
                        <button 
                            type="button" 
                            className="guest-button"
                            onClick={handleGuestAccess}
                            disabled={loading}
                        >
                            <i className="fa-solid fa-rocket"></i>
                            Continue as Guest
                        </button>
                    </div>
                )}

                <div className="auth-switch">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span 
                        className="auth-link" 
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setSuccess('');
                        }}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Auth;
