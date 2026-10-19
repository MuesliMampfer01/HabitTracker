import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Logo und Navigation */}
            <div className="flex items-center gap-4">
                <span className="text-xl font-black tracking-widest uppercase text-white">
                    Habittracker
                </span>

                <nav className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-full p-1.5 backdrop-blur-xl">
                    <button className="px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-slate800 text-white shadow-sm">
                        Dashboard
                    </button>
                    <button className="px-4 py-1.5 rounded-full text-xs font-bold uppercase text-slate-400 hover:text-white transition-colors">
                        Meine Habits
                    </button>
                    <button className="px-4 py-1.5 rounded-full text-xs font-bold uppercase text-slate-400 hover:text-white transition-colors">
                        Statistiken
                    </button> 
                </nav>
            </div>

            {/* User Info und Logout Insel */}
            <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-full p-1.5 backdrop-blur-xl">
                <span className="px-3 text-xs font-mono font-medium text-slate-300">
                    {user?.name || 'User'}
                </span>
                <button 
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase text-white transition-all cursor-pointer"
                >
                    <span>Abmelden</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </button>
            </div>
        </header>
    );
};
