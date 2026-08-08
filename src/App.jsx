import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import NewGoal from './pages/NewGoal';
import GoalDetail from './pages/GoalDetail';
import Analytics from './pages/Analytics';
import Reminders from './pages/Reminders';
import Alarms from './pages/Alarms';
import Account from './pages/Account';
import ChangePassword from './pages/ChangePassword';
import SharedGoal from './pages/SharedGoal';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const NewGoalRoute = () => {
  const { templateId } = useParams();
  return <NewGoal key={templateId || 'blank'} />;
};

function AppRoutes() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={!token ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
      <Route path="/reset-password" element={!token ? <ResetPassword /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
      <Route path="/goals/new" element={<ProtectedRoute><NewGoalRoute /></ProtectedRoute>} />
      <Route path="/goals/new/:templateId" element={<ProtectedRoute><NewGoalRoute /></ProtectedRoute>} />
      <Route path="/goals/:id" element={<ProtectedRoute><GoalDetail /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
      <Route path="/alarm" element={<ProtectedRoute><Alarms /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      <Route path="/shared/:id" element={<SharedGoal />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}