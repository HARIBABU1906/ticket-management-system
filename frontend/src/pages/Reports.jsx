import React, { useState, useEffect } from 'react';
import API from '../api';
import { FileDown, Filter } from 'lucide-react';

const Reports = () => {
    const [complaints, setComplaints] = useState([]);
    const [filters, setFilters] = useState({
        department: '',
        complaintType: '',
        status: ''
    });
    const [depts, setDepts] = useState([]);

    useEffect(() => {
        fetchData();
        fetchDepts();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await API.get('/complaints');
            setComplaints(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDepts = async () => {
        const { data } = await API.get('/master/departments');
        setDepts(data);
    };

    const filteredComplaints = complaints.filter(c => {
        return (!filters.department || c.raisedBy?.department === filters.department) &&
            (!filters.complaintType || c.type === filters.complaintType) &&
            (!filters.status || c.status === filters.status);
    });

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Complaint Reports</h1>
                <button className="export-btn"><FileDown size={18} /> Export CSV</button>
            </div>

            <div className="filter-bar">
                <div className="filter-group">
                    <label>Department</label>
                    <select onChange={e => setFilters({ ...filters, department: e.target.value })}>
                        <option value="">All Departments</option>
                        {depts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label>Type</label>
                    <select onChange={e => setFilters({ ...filters, complaintType: e.target.value })}>
                        <option value="">All Types</option>
                        {['PC Hardware', 'PC Software', 'Application Issues', 'Network', 'Electronics', 'Plumbing'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label>Status</label>
                    <select onChange={e => setFilters({ ...filters, status: e.target.value })}>
                        <option value="">All Statuses</option>
                        {['Pending', 'Assigned', 'In-Progress', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="table-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>User</th>
                            <th>Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComplaints.map(c => (
                            <tr key={c._id}>
                                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                <td>{c.raisedBy?.name}</td>
                                <td>{c.type}</td>
                                <td>{c.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                .page-container { padding: 40px; }
                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
                .export-btn { background: #1e293b; border: 1px solid #334155; color: white; padding: 10px 20px; display: flex; align-items: center; gap: 8px; }
                .filter-bar { background: var(--bg-card); padding: 20px; border-radius: 12px; margin-bottom: 24px; display: flex; gap: 20px; border: 1px solid #334155; }
                .filter-group label { display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 6px; }
                .filter-group select { min-width: 150px; background: #0f172a; }
                .table-card { background: var(--bg-card); border-radius: 16px; border: 1px solid #334155; overflow: hidden; }
                .data-table { width: 100%; border-collapse: collapse; }
                .data-table th { background: #1e293b; text-align: left; padding: 16px; font-size: 13px; color: var(--text-muted); }
                .data-table td { padding: 16px; border-top: 1px solid #334155; font-size: 14px; }
            `}</style>
        </div>
    );
};

export default Reports;
