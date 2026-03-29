import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageGroups from './pages/ManageGroups';
import ManageChains from './pages/ManageChains';
import ManageBrands from './pages/ManageBrands';
import ManageZones from './pages/ManageZones';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/groups" element={<PrivateRoute><ManageGroups /></PrivateRoute>} />
      <Route path="/chains" element={<PrivateRoute><ManageChains /></PrivateRoute>} />
      <Route path="/brands" element={<PrivateRoute><ManageBrands /></PrivateRoute>} />
      <Route path="/zones" element={<PrivateRoute><ManageZones /></PrivateRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}