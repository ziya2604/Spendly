import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Budgets from './pages/Budgets';
import Groups from './pages/Groups';
import Goals from './pages/Goals';
import Education from './pages/Education';
import Calculator from './pages/Calculator';
import Debts from './pages/Debts';
import Bills from './pages/Bills';
import Challenges from './pages/Challenges';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/expenses" element={
                    <ProtectedRoute><Expenses /></ProtectedRoute>
                } />
                <Route path="/income" element={
                    <ProtectedRoute><Income /></ProtectedRoute>
                } />
                <Route path="/budgets" element={
                    <ProtectedRoute><Budgets /></ProtectedRoute>
                } />
                <Route path="/groups" element={
                    <ProtectedRoute><Groups /></ProtectedRoute>
                } />
                <Route path="/goals" element={
                    <ProtectedRoute><Goals /></ProtectedRoute>
                } />
                <Route path="/education" element={
                    <ProtectedRoute><Education /></ProtectedRoute>
                } />
                <Route path="/calculator" element={
                    <ProtectedRoute><Calculator /></ProtectedRoute>
                } />
                <Route path="/debts" element={
                    <ProtectedRoute><Debts /></ProtectedRoute>
                } />
                <Route path="/bills" element={
                    <ProtectedRoute><Bills /></ProtectedRoute>
                } />
                <Route path="/challenges" element={
                    <ProtectedRoute><Challenges /></ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;