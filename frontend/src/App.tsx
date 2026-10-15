import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// Vorübergehende einfache Dashboard-Komponente zum Testen
const DashboardPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Willkommen im Dashboard! </h1>
        <p className="text-gray-600">Du hast dich erfolgreich angemeldet.</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Öffentliche Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* 2. Geschützte Routen (durch ProtectedRoute abgesichert) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* 3. Fallback Route: Alle unbekannten Pfade oder / leiten zum Dashboard weiter */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
