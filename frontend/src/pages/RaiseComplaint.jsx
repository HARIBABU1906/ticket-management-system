import React, { useState, useEffect, useRef } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { Send, Upload, X } from 'lucide-react';

const RaiseComplaint = () => {
    const [formData, setFormData] = useState({
        block: '',
        room: '',
        type: 'PC Hardware',
        remarks: ''
    });
    const [attachment, setAttachment] = useState(null);
    const [preview, setPreview] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [blocksRes, roomsRes] = await Promise.all([
                    API.get('/master/blocks'),
                    API.get('/master/rooms')
                ]);
                setBlocks(blocksRes.data);
                setRooms(roomsRes.data);
            } catch (err) {
                console.error(err);
            }
        }; 
        fetchData();
    }, []);

    useEffect(() => {
        if (formData.block) {
            const filtered = rooms.filter(r => r.block === formData.block || r.block?._id === formData.block);
            setFilteredRooms(filtered);
            // Reset room if not in filtered list
            if (!filtered.find(r => r._id === formData.room)) {
                setFormData(prev => ({ ...prev, room: '' }));
            }
        } else {
            setFilteredRooms([]);
        }
    }, [formData.block, rooms]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAttachment(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeFile = () => {
        setAttachment(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('block', formData.block);
        data.append('room', formData.room);
        data.append('type', formData.type);
        data.append('remarks', formData.remarks);
        if (attachment) {
            data.append('attachment', attachment);
        }

        try {
            await API.post('/complaints', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Complaint submitted successfully!');
            navigate('/dashboard');
        } catch (err) {
            alert('Error submitting complaint: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Raise New Complaint</h1>
                <p>Provide details about the issue you're facing</p>
            </div>

            <form onSubmit={handleSubmit} className="form-card">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Block Name</label>
                        <select
                            value={formData.block}
                            onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                            required
                        >
                            <option value="">Select Block</option>
                            {blocks.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Room Number</label>
                        <select
                            value={formData.room}
                            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                            required
                            disabled={!formData.block}
                        >
                            <option value="">Select Room</option>
                            {filteredRooms.map(r => (
                                <option key={r._id} value={r._id}>{r.roomNumber}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Complaint Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                        >
                            <option value="PC Hardware">PC Hardware</option>
                            <option value="PC Software">PC Software</option>
                            <option value="Application Issues">Application Issues</option>
                            <option value="Network">Network</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Plumbing">Plumbing</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>Complaint Remarks</label>
                        <textarea
                            rows="4"
                            placeholder="Describe the problem in detail..."
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            required
                        ></textarea>
                    </div>
                    
                    <div className="form-group full-width">
                        <label>Attachment (Optional)</label>
                        <input 
                            type="file" 
                            hidden 
                            ref={fileInputRef} 
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        
                        {!preview ? (
                            <div className="file-upload" onClick={() => fileInputRef.current.click()}>
                                <Upload size={20} />
                                <span>Click to upload screenshot</span>
                            </div>
                        ) : (
                            <div className="preview-container">
                                <img src={preview} alt="Preview" className="file-preview" />
                                <button type="button" className="remove-file-btn" onClick={removeFile}>
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={loading}>
                        <Send size={18} />
                        {loading ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                </div>
            </form>

            <style>{`
                .page-container {
                    padding: 40px;
                    max-width: 900px;
                }
                .page-header {
                    margin-bottom: 32px;
                }
                .page-header h1 {
                    font-size: 28px;
                    margin-bottom: 8px;
                }
                .page-header p {
                    color: var(--text-muted);
                }
                .form-card {
                    background: var(--bg-card);
                    padding: 32px;
                    border-radius: 20px;
                    border: 1px solid #334155;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }
                .full-width {
                    grid-column: span 2;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 10px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #cbd5e1;
                }
                .form-group input, .form-group select, .form-group textarea {
                    width: 100%;
                }
                .file-upload {
                    border: 2px dashed #334155;
                    border-radius: 12px;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .file-upload:hover {
                    border-color: var(--primary);
                    background: rgba(99, 102, 241, 0.05);
                    color: var(--primary);
                }
                .preview-container {
                    position: relative;
                    width: fit-content;
                }
                .file-preview {
                    max-width: 200px;
                    max-height: 200px;
                    border-radius: 12px;
                    border: 1px solid #334155;
                }
                .remove-file-btn {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .form-actions {
                    margin-top: 32px;
                    display: flex;
                    justify-content: flex-end;
                }
                .submit-btn {
                    background: var(--primary);
                    color: white;
                    padding: 12px 24px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .submit-btn:hover {
                    background: var(--primary-hover);
                }
            `}</style>
        </div>
    );
};

export default RaiseComplaint;
