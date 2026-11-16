import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { HabitsPage } from './pages/HabitsPage';
import { StatsPage } from './pages/StatisticsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Öffentliche Routen */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 2. Geschützte Routen (durch ProtectedRoute abgesichert) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Route>

        {/* 3. Fallback Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
