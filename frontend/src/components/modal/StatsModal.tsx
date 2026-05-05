import type { GameStats } from "../../types/index";

interface StatsModalProps {
  stats: GameStats;
  onClose: () => void;
}

export default function StatsModal({ stats, onClose }: StatsModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-neutral-800 rounded-lg p-8 w-80 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-center tracking-widest uppercase">
          Statistics
        </h2>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-3xl font-bold">{stats.totalGames}</p>
            <p className="text-xs text-neutral-400">Played</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.winPercentage}</p>
            <p className="text-xs text-neutral-400">Win %</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.currentStreak}</p>
            <p className="text-xs text-neutral-400">Streak</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.maxStreak}</p>
            <p className="text-xs text-neutral-400">Best</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold tracking-widest uppercase text-center mb-2">
            Guess Distribution
          </p>
          {Object.entries(stats.distribution).map(([num, count]) => (
            <div key={num} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-right">{num}</span>
              <div
                className="bg-green-600 h-5 flex items-center px-2 text-xs font-bold transition-all duration-500"
                style={{
                  width: `${Math.max(
                    (count /
                      Math.max(...Object.values(stats.distribution), 1)) *
                      100,
                    8,
                  )}%`,
                }}
              >
                {count}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-2 text-sm text-neutral-400 hover:text-white transition-colors text-center"
        >
          Close
        </button>
      </div>
    </div>
  );
}
