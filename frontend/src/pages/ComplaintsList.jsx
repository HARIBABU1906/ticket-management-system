import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { MoreVertical, UserPlus, CheckCircle } from 'lucide-react';

const ComplaintsList = () => {
    const [complaints, setComplaints] = useState([]);
    const [staff, setStaff] = useState([]);
    const { user } = useAuth();
    const isAdmin = user?.role === 'SuperAdmin';
    const isStaff = !isAdmin && user?.role !== 'User';

    useEffect(() => {
        fetchComplaints();
        if (isAdmin) fetchStaff();
    }, []);

    const fetchComplaints = async () => {
        try {
            const { data } = await API.get('/complaints');
            setComplaints(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStaff = async () => {
        try {
            const { data } = await API.get('/master/users');
            setStaff(data.filter(u => u.role.name !== 'User' && u.role.name !== 'SuperAdmin'));
        } catch (err) {
            console.error(err);
        }
    };

    const handleAssign = async (id, staffId) => {
        try {
            await API.put(`/complaints/${id}/assign`, { staffId });
            fetchComplaints();
        } catch (err) {
            alert('Error assigning staff');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await API.put(`/complaints/${id}/status`, { status });
            fetchComplaints();
        } catch (err) {
            alert('Error updating status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#f59e0b';
            case 'Assigned': return '#0ea5e9';
            case 'In-Progress': return '#6366f1';
            case 'Completed': return '#22c55e';
            default: return '#94a3b8';
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Complaints List</h1>
                <p>{isAdmin ? 'All department complaints' : 'Complaints related to you'}</p>
            </div>

            <div className="table-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Block/Room</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Assignee</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.map(c => (
                            <tr key={c._id}>
                                <td><span className="type-badge">{c.type}</span></td>
                                <td>{c.block?.name} / {c.room?.roomNumber}</td>
                                <td>{c.remarks}</td>
                                <td>
                                    <span className="status-pill" style={{ backgroundColor: `${getStatusColor(c.status)}20`, color: getStatusColor(c.status) }}>
                                        {c.status}
                                    </span>
                                </td>
                                <td>{c.assignedTo?.name || 'Unassigned'}</td>
                                <td>
                                    <div className="actions">
                                        {isAdmin && (
                                            <select
                                                className="assign-select"
                                                onChange={(e) => handleAssign(c._id, e.target.value)}
                                                value={c.assignedTo?._id || ''}
                                            >
                                                <option value="">Assign Staff</option>
                                                {staff.map(s => <option key={s._id} value={s._id}>{s.name} ({s.role.name})</option>)}
                                            </select>
                                        )}
                                        {isStaff && c.assignedTo?._id === user._id && (
                                            <select
                                                className="status-select"
                                                onChange={(e) => handleStatusUpdate(c._id, e.target.value)}
                                                value={c.status}
                                            >
                                                <option value="In-Progress">In-Progress</option>
                                                <option value="On-Hold">On-Hold</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                .page-container { padding: 40px; }
                .page-header { margin-bottom: 32px; }
                .table-card { background: var(--bg-card); border-radius: 16px; border: 1px solid #334155; overflow: hidden; }
                .data-table { width: 100%; border-collapse: collapse; }
                .data-table th { background: #1e293b; text-align: left; padding: 16px; font-size: 13px; color: var(--text-muted); }
                .data-table td { padding: 16px; border-top: 1px solid #334155; font-size: 14px; }
                .type-badge { font-weight: 600; color: #cbd5e1; }
                .status-pill { padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
                .assign-select, .status-select { background: #0f172a; border: 1px solid #334155; color: white; padding: 6px; border-radius: 6px; font-size: 12px; }
                .actions { display: flex; gap: 8px; }
            `}</style>
        </div>
    );
};

export default ComplaintsList;
