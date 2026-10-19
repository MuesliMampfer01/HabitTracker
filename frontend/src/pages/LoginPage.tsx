import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import axios from "axios";

export const LoginPage = () => {
    // Zustände
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    // Laden von Context und den Navigation Hook
    const { login } = useAuth();
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

        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
              const detail = err.response?.data?.detail;

              if (typeof detail === 'string') {
                  setError(detail);
              } else if (Array.isArray(detail)) {
                  setError(detail.map((e: { msg: string }) => e.msg).join(', '));
              } else {
                  setError('Anmeldung fehlgeschlagen. Bitte Zugangsdaten prüfen.');
              }
          } else {
              setError('Ein unerwarteter Fehler ist aufgetreten.');
          }
      } finally {
          setIsSubmitting(false);
      }
    };

    return (
      <div 
        className="flex min-h-screen w-full items-center justify-center p-4 font-mono text-slate-100"
        style={{
          background: 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 40%, #080a0f 100%)'
        }}
      >
        {/* Terminal Card */}
        <div className="w-full max-w-md rounded-2xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl">

          {/* Logo & Header */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2 text-base font-bold tracking-wider">
              <span className="animate-pulse text-emerald-400">&gt;_</span>
              <span className="bg-emerald-500 text-black px-2 py-0.5 font-black uppercase">
                HABITTRACKER
              </span>
              <span className="text-xs text-emerald-500/50">[v1.0]</span>
            </div>
            
            <p className="text-[11px] text-slate-500 tracking-widest uppercase mt-1">
              &gt; SYSTEM_LOGIN
            </p>
          </div>

          {/* Terminal Error Box */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-400 text-center">
              ERROR: {error}
            </div>
          )}

          {/* Anmeldelogik */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-sm text-emerald-400 placeholder-slate-600 focus:border-emerald-500/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all"
              />
            </div>

            {/* Passwortfeld */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                Passwort
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-sm text-emerald-400 placeholder-slate-600 focus:border-emerald-500/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all"
              />
            </div>

            {/* Anmelde Knopf */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-500 py-3 mt-2 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              {isSubmitting ? 'AUTHENTIFIZIERE...' : 'ANMELDEN'}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-xs text-slate-400">
            Noch kein Konto?{' '}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium underline transition-colors">
              Hier registrieren
            </Link>
          </p>
        </div>
      </div>
    );
};
