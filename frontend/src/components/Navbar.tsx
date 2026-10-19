import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono pb-4 text-emerald-500">
            {/* Logo */}
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold tracking-wider">
                <span className="animate-pulse text-emerald-400">&gt;_</span>
                <span className="bg-emerald-500 text-black px-2 py-0.5 font-black uppercase">
                    HABITTRACKER
                </span>
                <span className="text-xs text-emerald-500/50">[v1.0]</span>
            </div>

            <nav className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 backdrop-blur-xl">
                <button className="px-4 py-1.5 rounded-lg text-xs font-mono uppercase bg-slate800 text-white shadow-sm">
                    Dashboard
                </button>
                <button className="px-4 py-1.5 rounded-lg text-xs font-mono uppercase text-slate-400 hover:text-white transition-colors">
                    Habits
                </button>
                <button className="px-4 py-1.5 rounded-lg text-xs font-mono uppercase text-slate-400 hover:text-white transition-colors">
                    Statistiken
                </button> 
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
