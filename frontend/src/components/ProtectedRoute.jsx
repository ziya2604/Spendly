import { Navigate } from 'react-router-dom';

// If no token in localStorage, send to login
// Otherwise render whatever page was requested
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;