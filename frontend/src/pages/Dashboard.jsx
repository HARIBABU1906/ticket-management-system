import React, { useEffect, useState } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { Layout, ClipboardList, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, assigned: 0, closed: 0 });
    const { user, logout } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get('/complaints/stats');
                setStats(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Complaints', value: stats.total, icon: <ClipboardList />, color: '#6366f1' },
        { label: 'Pending', value: stats.pending, icon: <Clock />, color: '#f59e0b' },
        { label: 'Assigned', value: stats.assigned, icon: <AlertCircle />, color: '#0ea5e9' },
        { label: 'Closed', value: stats.closed, icon: <CheckCircle2 />, color: '#22c55e' },
    ];

    return (
        <div className="dashboard-container">
            <header className="dash-header">
                <div className="welcome">
                    <h2>Welcome, {user?.name}</h2>
                    <span className="role-badge">{user?.role}</span>
                </div>
                <button onClick={logout} className="logout-btn">Logout</button>
            </header>

            <div className="stats-grid">
                {statCards.map((card, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                            {card.icon}
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">{card.label}</span>
                            <span className="stat-value">{card.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .dashboard-container {
                    padding: 32px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .dash-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                }
                .welcome h2 {
                    font-size: 24px;
                    margin-bottom: 4px;
                }
                .role-badge {
                    background: #334155;
                    padding: 4px 12px;
                    border-radius: 99px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #94a3b8;
                    text-transform: uppercase;
                }
                .logout-btn {
                    padding: 8px 16px;
                    background: transparent;
                    border: 1px solid #334155;
                    color: #94a3b8;
                }
                .logout-btn:hover {
                    background: #334155;
                    color: white;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 24px;
                }
                .stat-card {
                    background: var(--bg-card);
                    padding: 24px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    border: 1px solid #334155;
                }
                .stat-icon {
                    padding: 16px;
                    border-radius: 12px;
                }
                .stat-info {
                    display: flex;
                    flex-direction: column;
                }
                .stat-label {
                    color: var(--text-muted);
                    font-size: 14px;
                }
                .stat-value {
                    font-size: 28px;
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
