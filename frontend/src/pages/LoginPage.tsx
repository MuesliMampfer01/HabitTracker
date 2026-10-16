import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export const LoginPage = () => {
    // Zustände
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    // Laden von Context und den Navigation Hook
    const { login } = useAuth(); // nimmt sich nur das logincontext aus dem Provider 
    const navigate = useNavigate();

    // Absendelogik
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // 1. Daten als Form-Data aufbereiten (OAuth2 Standard)
            const formData = new URLSearchParams();
            formData.append('username', email); // FastAPI erwartet hier 'username'
            formData.append('password', password);

            // 2. An FastAPI senden
            const response = await api.post('/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            // 3. Token & User auswerten
            const { access_token, user } = response.data;

            login(access_token, user);
            navigate('/dashboard');

        } catch (err: any) {
            const detail = err.response?.data?.detail;

            if (typeof detail === 'string') {
                setError(detail);
            } else if (Array.isArray(detail)) {
                setError(detail.map((e: any) => e.msg).join(', '));
            } else {
                setError('Anmeldung fehlgeschlagen. Bitte Zugangsdaten prüfen.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Anmelden</h2>

        {/* Fehleranzeige */}
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-Mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Passwort</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Noch kein Konto?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Hier registrieren
          </Link>
        </p>
      </div>
    </div>
  );
};

