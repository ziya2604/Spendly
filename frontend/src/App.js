import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Onboarding from './pages/Onboarding';

import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Groups from './pages/Groups';
import Debts from './pages/Debts';
import Bills from './pages/Bills';
import Challenges from './pages/Challenges';
import Education from './pages/Education';
import Calculator from './pages/Calculator';
import About from './pages/About';

import SupportWidget from './components/SupportWidget';
import { ThemeProvider } from './utils/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>

        <Routes>

          <Route
            path="/"
            element={<Navigate to="/login" />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/onboarding"
            element={<Onboarding />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/expenses"
            element={<Expenses />}
          />

          <Route
            path="/income"
            element={<Income />}
          />

          <Route
            path="/budgets"
            element={<Budgets />}
          />

          <Route
            path="/goals"
            element={<Goals />}
          />

          <Route
            path="/groups"
            element={<Groups />}
          />

          <Route
            path="/debts"
            element={<Debts />}
          />

          <Route
            path="/bills"
            element={<Bills />}
          />

          <Route
            path="/challenges"
            element={<Challenges />}
          />

          <Route
            path="/education"
            element={<Education />}
          />

          <Route
            path="/calculator"
            element={<Calculator />}
          />

          <Route
            path="/about"
            element={<About />}
          />

        </Routes>

        <SupportWidget />

      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;