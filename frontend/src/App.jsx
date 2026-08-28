import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RaiseComplaint from './pages/RaiseComplaint';
import ComplaintsList from './pages/ComplaintsList';
import Layout from './components/Layout';
import MasterList from './pages/MasterList';
import Reports from './pages/Reports';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/raise-complaint" element={<PrivateRoute><RaiseComplaint /></PrivateRoute>} />
          <Route path="/complaints" element={<PrivateRoute><ComplaintsList /></PrivateRoute>} />

          <Route path="/master/departments" element={<PrivateRoute><MasterList type="departments" title="Departments" fields={['name', 'shortName', 'description']} /></PrivateRoute>} />
          <Route path="/master/programmes" element={<PrivateRoute><MasterList type="programmes" title="Programmes" fields={['name', 'shortName', 'department']} /></PrivateRoute>} />
          <Route path="/master/blocks" element={<PrivateRoute><MasterList type="blocks" title="Blocks" fields={['name', 'department', 'programme']} /></PrivateRoute>} />
          <Route path="/master/rooms" element={<PrivateRoute><MasterList type="rooms" title="Rooms" fields={['roomNumber', 'block', 'department', 'programme']} /></PrivateRoute>} />
          <Route path="/master/roles" element={<PrivateRoute><MasterList type="roles" title="Roles" fields={['name']} /></PrivateRoute>} />
          <Route path="/master/users" element={<PrivateRoute><MasterList type="users" title="Users" fields={['name', 'email', 'phone', 'password', 'role', 'department', 'programme']} /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
