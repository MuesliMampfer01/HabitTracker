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
            // Daten als Form-Data aufbereiten OAuth
            const formData = new URLSearchParams();
            formData.append('username', email); 
            formData.append('password', password);

            // An FastAPI senden
            const response = await api.post('/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            // Token & User auswerten
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
      <div 
        className="flex min-h-screen w-full items-center justify-center text-slate-100 p-4"
        style={{
          background: 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 40%, #080a0f 100%)'
        }}
      >
        <div className="w-full max-w-md rounded-3xl bg-gray-50/20 p-8 shadow-2xl backdrop-blur-xl text-slate-100">

          {/* Header */}
            <div className="mb-6 text-center">
                <h2 className="mt-3 text-3xl font-mono uppercase tracking-tight text-white">
                Anmelden
                </h2>
            </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs font-mono text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Anmeldelogik */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  E-Mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700/70 bg-slate-800/40 p-3 text-sm font-mono text-white placeholder-slate-500 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>

            {/* Passwortfeld */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Passwort
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700/70 bg-slate-800/40 p-3 text-sm text-white placeholder-slate-500 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>

            {/* Anmelde Knopf */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-white py-3 mt-2 text-sm font-mono uppercase tracking-wider text-slate-900 transition-all hover:bg-slate-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
            >
              {isSubmitting ? 'Anmelden...' : 'Anmelden'}
            </button>
          </form>

          {/* Footer Link */}
            <p className="mt-6 text-center text-xs font-mono text-slate-400">
              Noch kein Konto?{' '}
              <Link to="/register" className="text-white hover:text-slate-300 font-medium transition-colors">
                Hier registrieren
              </Link>
            </p>
          </div>
        </div>
    );
};

