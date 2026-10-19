import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export const RegisterPage = () => {
    // Zustände
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

            navigate('/login');
        } catch (err: any) {
            const detail = err.response?.data?.detail;

            if (typeof detail === 'string') {
                setError(detail);
            } else if (Array.isArray(detail)) {
                setError(detail.map((e: any) => e.msg).join(', '));
            } else {
                setError('Registrierung fehlgeschlagen. Bitte Eingaben prüfen.');
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
            
                {/* Logo und Header */}
                <div className="mb-8 flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center gap-2 text-base font-bold tracking-wider">
                        <span className="animate-pulse text-emerald-400">&gt;_</span>
                        <span className="bg-emerald-500 text-black px-2 py-0.5 font-black uppercase">
                            HABITTRACKER
                        </span>
                        <span className="text-xs text-emerald-500/50">[v1.0]</span>
                    </div>
                    
                    <p className="text-[11px] text-slate-500 tracking-widest uppercase mt-1">
                        &gt; CREATE_ACCOUNT
                    </p>
                </div>

                {/* Terminal Error Box */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-400 text-center">
                        ERROR: {error}
                    </div>
                )}

                {/* Formular */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Dein Name"
                            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-sm text-emerald-400 placeholder-slate-600 focus:border-emerald-500/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all"
                        />
                    </div>

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

                    <div>
                        <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                            Passwort wiederholen
                        </label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-sm text-emerald-400 placeholder-slate-600 focus:border-emerald-500/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all"
                        />
                    </div>

                    {/* Reg-Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-emerald-500 py-3 mt-2 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                        {isSubmitting ? 'REGISTRIERE' : 'ACCOUNT ERSTELLEN'}
                    </button>
                </form>

                {/* Footer Link */}
                <p className="mt-6 text-center text-xs text-slate-400">
                    Bereits ein Konto?{' '}
                    <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium underline transition-colors">
                        Hier anmelden
                    </Link>
                </p>
            </div>
        </div>
    );
};
