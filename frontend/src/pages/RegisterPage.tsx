import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
            setError('Passwords dont match');
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
                setError('Registry failed. Please check Inputs')
            }
        }finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Konto erstellen</h2>

            {/* Fehleranzeige */}
            {error && (
                <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                />
                </div>

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

                <div>
                <label className="block text-sm font-medium text-gray-700">Passwort wiederholen</label>
                <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                />
                </div>

                <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300 cursor-pointer"
                >
                {isSubmitting ? 'Registriere...' : 'Registrieren'}
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
                Bereits ein Konto?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                Hier anmelden
                </Link>
            </p>
            </div>
        </div>
    );
}
