import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    PlusCircle,
    List,
    FileText,
    Settings,
    Users,
    Box,
    Home,
    Layers,
    UserCircle
} from 'lucide-react';

const Sidebar = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'SuperAdmin';

    return (
        <div className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-dot"></div>
                <span>Ticket Manager</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                {(isAdmin || user?.role === 'User') && (
                    <NavLink to="/raise-complaint" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <PlusCircle size={20} />
                        <span>Raise Complaint</span>
                    </NavLink>
                )}

                <NavLink to="/complaints" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <List size={20} />
                    <span>Complaints List</span>
                </NavLink>

                {isAdmin && (
                    <div className="nav-group">
                        <div className="nav-group-header">Master Records</div>
                        <NavLink to="/master/departments" className="nav-item">
                            <Home size={18} />
                            <span>Departments</span>
                        </NavLink>
                        <NavLink to="/master/programmes" className="nav-item">
                            <Layers size={18} />
                            <span>Programmes</span>
                        </NavLink>
                        <NavLink to="/master/blocks" className="nav-item">
                            <Box size={18} />
                            <span>Blocks</span>
                        </NavLink>
                        <NavLink to="/master/rooms" className="nav-item">
                            <Settings size={18} />
                            <span>Rooms</span>
                        </NavLink>
                        <NavLink to="/master/roles" className="nav-item">
                            <UserCircle size={18} />
                            <span>Roles</span>
                        </NavLink>
                        <NavLink to="/master/users" className="nav-item">
                            <Users size={18} />
                            <span>Users</span>
                        </NavLink>
                    </div>
                )}

                {isAdmin && (
                    <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <FileText size={20} />
                        <span>Reports</span>
                    </NavLink>
                )}
            </nav>

            <style>{`
                .sidebar {
                    width: 260px;
                    background: var(--bg-card);
                    border-right: 1px solid #334155;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    position: sticky;
                    top: 0;
                }
                .sidebar-brand {
                    padding: 32px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 700;
                    font-size: 18px;
                    color: white;
                }
                .brand-dot {
                    width: 12px;
                    height: 12px;
                    background: var(--primary);
                    border-radius: 50%;
                    box-shadow: 0 0 10px var(--primary);
                }
                .sidebar-nav {
                    flex: 1;
                    padding: 0 16px;
                }
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    color: var(--text-muted);
                    text-decoration: none;
                    border-radius: 12px;
                    margin-bottom: 4px;
                    transition: all 0.2s;
                    font-size: 14px;
                    font-weight: 500;
                }
                .nav-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }
                .nav-item.active {
                    background: rgba(99, 102, 241, 0.1);
                    color: var(--primary);
                }
                .nav-group {
                    margin-top: 24px;
                    margin-bottom: 8px;
                }
                .nav-group-header {
                    padding: 0 16px 8px;
                    font-size: 11px;
                    font-weight: 700;
                    color: #475569;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
            `}</style>
        </div>
    );
};

export default Sidebar;
