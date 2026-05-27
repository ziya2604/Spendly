import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Onboarding from './pages/Onboarding';

import SupportWidget from './components/SupportWidget';

import { ThemeProvider } from './utils/ThemeContext';

function App() {

  return (

    <ThemeProvider>

      <BrowserRouter>

        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
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
            path="/onboarding"
            element={<Onboarding />}
          />

          <Route
            path="/"
            element={
              <Navigate to="/login" />
            }
          />

        </Routes>

        <SupportWidget />

      </BrowserRouter>

    </ThemeProvider>

  );

}

export default App;