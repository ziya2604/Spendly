import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login      from './pages/Login';
import Signup     from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard  from './pages/Dashboard';
import Expenses   from './pages/Expenses';
import Income     from './pages/Income';
import Budgets    from './pages/Budgets';
import Groups     from './pages/Groups';
import Goals      from './pages/Goals';
import Debts      from './pages/Debts';
import Bills      from './pages/Bills';
import Challenges from './pages/Challenges';
import Education  from './pages/Education';
import Calculator from './pages/Calculator';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"           element={<Navigate to="/login" />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/signup"     element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Every route below requires login */}
          <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/expenses"   element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/income"     element={<ProtectedRoute><Income /></ProtectedRoute>} />
          <Route path="/budgets"    element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
          <Route path="/groups"     element={<ProtectedRoute><Groups /></ProtectedRoute>} />
          <Route path="/goals"      element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/debts"      element={<ProtectedRoute><Debts /></ProtectedRoute>} />
          <Route path="/bills"      element={<ProtectedRoute><Bills /></ProtectedRoute>} />
          <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
          <Route path="/education"  element={<ProtectedRoute><Education /></ProtectedRoute>} />
          <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;