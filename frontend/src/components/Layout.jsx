import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
            <style>{`
                .app-layout {
                    display: flex;
                    min-height: 100vh;
                }
                .main-content {
                    flex: 1;
                    overflow-y: auto;
                    background-color: var(--bg-dark);
                }
            `}</style>
        </div>
    );
};

export default Layout;
