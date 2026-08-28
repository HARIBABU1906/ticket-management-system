import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { LogIn, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', { email, password });
            login(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="login-container">
            <div className="login-glass">
                <div className="login-header">
                    <div className="logo-icon">
                        <ShieldCheck size={40} color="#6366f1" />
                    </div>
                    <h1>Ticket System</h1>
                    <p>Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn">
                        <LogIn size={20} style={{ marginRight: '8px' }} />
                        Sign In
                    </button>
                </form>
            </div>

            <style>{`
                .login-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background: radial-gradient(circle at top left, #1e293b, #0f172a);
                }
                .login-glass {
                    background: rgba(30, 41, 59, 0.7);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 24px;
                    width: 100%;
                    max-width: 440px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 32px;
                }
                .logo-icon {
                    background: rgba(99, 102, 241, 0.1);
                    width: 80px;
                    height: 80px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                }
                .login-header h1 {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    background: linear-gradient(to right, #818cf8, #c084fc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .login-header p {
                    color: #94a3b8;
                    font-size: 14px;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #cbd5e1;
                }
                .form-group input {
                    width: 100%;
                    padding: 14px;
                }
                .login-btn {
                    width: 100%;
                    background: var(--primary);
                    color: white;
                    padding: 14px;
                    font-size: 16px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 12px;
                }
                .login-btn:hover {
                    background: var(--primary-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
                }
                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    color: #f87171;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 14px;
                    margin-bottom: 20px;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }
            `}</style>
        </div>
    );
};

export default Login;
