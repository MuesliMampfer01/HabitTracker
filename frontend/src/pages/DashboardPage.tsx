import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { HabitCard } from "../components/HabitCard";

//Hilfsfunktion für Tageszeit
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
};

export const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <div
            className="min-h-screen w-full text-slate-100 p-6 md:p-10"
            style={{
                background: 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 40%, #080a0f 100%)'
            }}
        >
            <div className="max-w-7xl mx-auto space-y-8">
                <Navbar />
                {/* Hier Begrüßung */}
                <section className="space-y-2">
                    <h1 className="text-3xl md:text-5xl font-mono tracking-tight text-white">
                        {getGreeting()}, {user?.name || ''}
                    </h1>
                    <p className="text-sm text-slate-400 font-mono">
                        Heute hast du schon <span className="text-emerald-400 font-bold">4 von 6</span> Gewohnheiten erledigt.
                    </p>
                </section>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                <HabitCard 
                    title="3L Wasser trinken" 
                    category="Health" 
                    streak={5} 
                    isCompleted={true} 
                    onToggle={() => {}} 
                />
                <HabitCard 
                    title="30 Min. Lesen" 
                    category="Mind" 
                    streak={3} 
                    isCompleted={false} 
                    onToggle={() => {}} 
                />
                <HabitCard 
                    title="Workout" 
                    category="Fitness" 
                    streak={12} 
                    isCompleted={false} 
                    onToggle={() => {}} 
                />
            </div>
        </div>
    );
};
