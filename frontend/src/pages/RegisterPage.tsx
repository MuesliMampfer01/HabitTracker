import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export const RegisterPage = () => {
    // Zustände
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 


    const navigate = useNavigate();

    // Absendelogik
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwörter stimmen nicht überein.');
            return;
        }

        setIsSubmitting(true);

        try {

            await api.post('/register', {
                name,
                email,
                password
            });

            navigate('/login')
        } catch (err: any) {
            const detail = err.response?.data?.detail;

            if (typeof detail === 'string') {
                setError(detail);
            } else if (Array.isArray(detail)) {
                setError(detail.map((e: any) => e.msg).join(', '));
            } else {
                setError('Registrierung fehlgeschlagen. Bitte Eingaben prüfen.')
            }
        }finally {
            setIsSubmitting(false);
        }
    };

    return (
  <div 
    className="min-h-screen w-full flex items-center justify-center p-4 text-slate-100"
    style={{
      background: 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 40%, #080a0f 100%)'
    }}
  >
    {/* Kachel */}
    <div className="w-full max-w-md rounded-3xl bg-gray-50/20 p-8 shadow-2xl backdrop-blur-xl text-slate-100">
      
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="mt-3 text-3xl font-mono uppercase tracking-tight text-white">
          Registrieren
        </h2>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs font-mono text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Formular */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-700/70 bg-slate-800/40 p-3 text-sm font-mono text-white placeholder-slate-500 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
          />
        </div>

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

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Passwort wiederholen
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700/70 bg-slate-800/40 p-3 text-sm text-white placeholder-slate-500 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
          />
        </div>

        {/* Reg-Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-white py-3 mt-2 text-sm font-mono uppercase tracking-wider text-slate-900 transition-all hover:bg-slate-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
        >
          {isSubmitting ? 'Registriere...' : 'Registrieren'}
        </button>
      </form>

      {/* Footer Link */}
      <p className="mt-6 text-center text-xs font-mono text-slate-400">
        Bereits ein Konto?{' '}
        <Link to="/login" className="text-white hover:text-slate-300 font-medium transition-colors">
          Hier anmelden
        </Link>
      </p>
    </div>
  </div>
);
}
