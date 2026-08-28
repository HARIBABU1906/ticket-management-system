import React, { useState, useEffect } from 'react';
import API from '../api';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';

const MasterList = ({ type, title, fields }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [options, setOptions] = useState({});
    const [editingId, setEditingId] = useState(null);

    // Related models mapping for fetching options
    const relatedModels = {
        department: 'departments',
        programme: 'programmes',
        block: 'blocks',
        room: 'rooms',
        role: 'roles'
    };

    useEffect(() => {
        fetchItems();
        fetchOptions();
    }, [type]);

    const fetchItems = async () => {
        try {
            const { data } = await API.get(`/master/${type}`);
            setItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOptions = async () => {
        const neededOptions = fields.filter(f => relatedModels[f]);
        const newOptions = {};
        for (const field of neededOptions) {
            try {
                const { data } = await API.get(`/master/${relatedModels[field]}`);
                newOptions[field] = data;
            } catch (err) {
                console.error(`Error fetching ${field} options:`, err);
            }
        }
        setOptions(newOptions);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/master/${type}/${editingId}`, formData);
            } else {
                await API.post(`/master/${type}`, formData);
            }
            setShowModal(false);
            setFormData({});
            setEditingId(null);
            fetchItems();
        } catch (err) {
            alert(`Error ${editingId ? 'updating' : 'adding'} item: ` + (err.response?.data?.message || err.message));
        }
    };

    const openEditModal = (item) => {
        const initialData = {};
        fields.forEach(f => {
            // Check if it's an object (populated field), extract its _id
            if (item[f] && typeof item[f] === 'object') {
                initialData[f] = item[f]._id;
            } else {
                initialData[f] = item[f] || '';
            }
        });
        setFormData(initialData);
        setEditingId(item._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await API.delete(`/master/${type}/${id}`);
                fetchItems();
            } catch (err) {
                alert('Error deleting item');
            }
        }
    };

    const getDisplayName = (item, field) => {
        const val = item[field];
        if (!val) return 'N/A';
        if (typeof val === 'object') {
            return val.name || val.roomNumber || 'Unknown';
        }
        return val;
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>{title}</h1>
                    <p>Manage {title.toLowerCase()} records</p>
                </div>
                <button onClick={() => { setFormData({}); setEditingId(null); setShowModal(true); }} className="add-btn">
                    <Plus size={18} />
                    Add {title.replace(/s$/, '')}
                </button>
            </div>

            <div className="table-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            {fields.map(f => <th key={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</th>)}
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr><td colSpan={fields.length + 1} style={{ textAlign: 'center', padding: '40px' }}>No records found</td></tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item._id}>
                                    {fields.map(f => (
                                        <td key={f}>
                                            {getDisplayName(item, f)}
                                        </td>
                                    ))}
                                    <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        <button 
                                            onClick={() => openEditModal(item)}
                                            className="edit-btn"
                                            title="Edit Record"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            className="delete-btn"
                                            title="Delete Record"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>{editingId ? 'Edit' : 'Add New'} {title.replace(/s$/, '')}</h2>
                        <form onSubmit={handleAdd}>
                            {fields.map(f => (
                                <div key={f} className="form-group">
                                    <label>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                                    {relatedModels[f] ? (
                                        <select
                                            value={formData[f] || ''}
                                            onChange={(e) => setFormData({ ...formData, [f]: e.target.value })}
                                            required
                                            className="form-input"
                                        >
                                            <option value="">Select {f}...</option>
                                            {options[f]?.map(opt => (
                                                <option key={opt._id} value={opt._id}>
                                                    {opt.name || opt.roomNumber}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData[f] || ''}
                                            onChange={(e) => setFormData({ ...formData, [f]: e.target.value })}
                                            required
                                            className="form-input"
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="modal-footer">
                                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setFormData({}); }} className="cancel-btn">Cancel</button>
                                <button type="submit" className="save-btn">{editingId ? 'Update' : 'Save'} Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .page-container { padding: 40px; }
                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
                .add-btn { background: var(--primary); border: none; border-radius: 8px; color: white; padding: 10px 20px; display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; }
                .table-card { background: var(--bg-card); border-radius: 16px; border: 1px solid #334155; overflow: hidden; }
                .data-table { width: 100%; border-collapse: collapse; }
                .data-table th { background: #1e293b; text-align: left; padding: 16px; font-size: 13px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .data-table td { padding: 16px; border-top: 1px solid #334155; font-size: 14px; }
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .modal-card { background: #0f172a; padding: 32px; border-radius: 20px; width: 100%; max-width: 450px; border: 1px solid #334155; color: white; }
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; margin-bottom: 8px; font-size: 14px; color: #94a3b8; }
                .form-input { width: 100%; padding: 12px; background: #1e293b; border: 1px solid #334155; border-radius: 12px; color: white; outline: none; box-sizing: border-box; }
                .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
                .save-btn { background: var(--primary); color: white; border: none; border-radius: 8px; padding: 10px 20px; cursor: pointer; }
                .cancel-btn { background: transparent; color: #94a3b8; border: none; cursor: pointer; }
                .delete-btn { background: transparent; color: #ef4444; border: 1px solid #ef4444; padding: 6px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
                .delete-btn:hover { background: #ef4444; color: white; }
                .edit-btn { background: transparent; color: #3b82f6; border: 1px solid #3b82f6; padding: 6px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
                .edit-btn:hover { background: #3b82f6; color: white; }
            `}</style>
        </div>
    );
};

export default MasterList;
