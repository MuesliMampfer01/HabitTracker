
interface HabitCardProps {
    title: string;
    category?: string;
    streak: number;
    isCompleted: boolean;
    onToggle: () => void;
}

export const HabitCard = ({
    title, 
    category = "Routine",
    streak,
    isCompleted,
    onToggle
}: HabitCardProps) => {
    return (
        <div className={`font-mono rounded-lg border p-5 flex flex-col justify-between h-56 transition all backdrop-blur-md ${
            isCompleted
                ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
        >
            {/* Kachel-Header */}
            <div className="flex items-center justify-between text-xs">
                <span className="rounded-lg bg-slate-800/80 px-2.5 py-0.5 text-[10px] font-mono- text-slate-400 border border-slate-700/50 uppercase">
                {category}
                </span>
                <span className="text-emerald-400 font-mono tracking-wider text-[11px]">
                    STREAK: {streak}d 
                </span>
            </div>

            {/* Hauptinhalt */}
            <div className="my-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                    &gt; ZIEL
                </p>
                <h3 className="text-lg font-mono uppercase tracking-tight text-white mt-1 line-clamp-2">
                    {title}
                </h3>
            </div>

            {/* Buttons: Erledigen/Details */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <button
                    onClick={onToggle}
                    className={`py-2 px-3 rounded-lg fond-mono uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isCompleted
                            ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-800 text-slate-200 border border-slate-700/60 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                    {isCompleted ? (
                        <>
                            <span>✓</span>
                            <span>Erledigt</span>
                        </>
                    ) : (
                        <>
                            <span>●</span>
                            <span>Erledigen</span>
                        </>
                    )}
                </button>

                <button className="py-2 px-3 rounded-lg font-mono uppercase text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200 transition-all text-center">
                    Details
                </button>
            </div>
        </div>
    );
};
