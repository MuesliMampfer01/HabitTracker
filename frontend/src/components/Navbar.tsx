import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Hilfsfunktion für Styling
    const getLinkStyle = (path: string) => {
        const isActive = location.pathname === path;
        return `px-4 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors ${
            isActive
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
        }`;
    };

    return (
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono pb-4 text-emerald-500">
            {/* Logo (klickbar zurück zum Dashboard) */}
            <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-sm sm:text-base font-bold tracking-wider"
            >
                <span className="animate-pulse text-emerald-400">&gt;_</span>
                <span className="bg-emerald-500 text-black px-2 py-0.5 font-black uppercase">
                    HABITTRACKER
                </span>
                <span className="text-xs text-emerald-500/50">[v1.0]</span>
            </Link>

            {/* Navigation Insel */}
            <nav className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 backdrop-blur-xl">
                <Link to="/dashboard" className={getLinkStyle("/dashboard")}>
                    Dashboard
                </Link>
                <Link to="/habits" className={getLinkStyle("/habits")}>
                    Habits
                </Link>
                <Link to="/stats" className={getLinkStyle("/stats")}>
                    Statistiken
                </Link> 
            </nav>
    
            {/* User Info und Logout Insel */}
            <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 backdrop-blur-xl">
                <span className="px-3 text-xs font-mono text-slate-300">
                    {user?.name || 'User'}
                </span>
                <button 
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono uppercase text-white transition-all cursor-pointer"
                >
                    <span>Abmelden</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </button>
            </div>
        </header>
    );
};
