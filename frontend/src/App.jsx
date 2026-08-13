import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import PrivateRoute from './components/PrivateRoute';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Features from './pages/Features';
import About from './pages/About';
import Learn from './pages/Learn';

// Protected pages
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Income from './pages/Income';
import Groups from './pages/Groups';
import Debts from './pages/Debts';
import Bills from './pages/Bills';
import Challenges from './pages/Challenges';
import Calculator from './pages/Calculator';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — marketing nav + footer */}
        <Route element={<PublicLayout />}>
          <Route path="/"         element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about"    element={<About />} />
          <Route path="/learn"    element={<Learn />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/signup"   element={<Signup />} />
        </Route>

        {/* Protected routes — app nav, no footer */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/expenses"   element={<Expenses />} />
            <Route path="/budgets"    element={<Budgets />} />
            <Route path="/goals"      element={<Goals />} />
            <Route path="/income"     element={<Income />} />
            <Route path="/groups"     element={<Groups />} />
            <Route path="/debts"      element={<Debts />} />
            <Route path="/bills"      element={<Bills />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/calculator" element={<Calculator />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}