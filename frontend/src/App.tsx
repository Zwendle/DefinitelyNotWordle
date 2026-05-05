import { useEffect, useCallback, useState } from "react";
import useGame from "./hooks/useGame";
import Board from "./components/board/Board";
import Keyboard from "./components/keyboard/Keyboard";
import StatsModal from "./components/modal/StatsModal";

export default function App() {
  const {
    session,
    currentGuess,
    error,
    isLoading,
    letterStates,
    addLetter,
    deleteLetter,
    submitGuess,
    fetchStats,
    stats,
  } = useGame();

  const [showStats, setShowStats] = useState(false);

  // Physical keyboard support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key === "Enter") {
        submitGuess();
      } else if (e.key === "Backspace") {
        deleteLetter();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        addLetter(e.key.toUpperCase());
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [submitGuess, deleteLetter, addLetter]);

  // Auto-show stats when game ends
  useEffect(() => {
    if (session?.status === "WON" || session?.status === "LOST") {
      fetchStats();
      setTimeout(() => setShowStats(true), 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.status]);

  const handleStatsOpen = useCallback(() => {
    fetchStats();
    setShowStats(true);
  }, [fetchStats]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-900">
        <p className="text-white text-lg">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-neutral-900 text-white">
      {/* Header */}
      <header className="w-full max-w-lg flex items-center justify-between px-4 py-4 border-b border-neutral-700">
        <h1 className="text-2xl font-bold tracking-widest uppercase">
          DefinitelyNotWordle
        </h1>
        <button
          onClick={handleStatsOpen}
          className="text-lg text-neutral-400 hover:text-white transition-colors"
        >
          Stats
        </button>
      </header>

      {/* Error banner */}
      {error && (
        <div className="mt-4 px-4 py-2 bg-red-800 text-white rounded text-sm">
          {error}
        </div>
      )}

      {/* Game over message */}
      {session?.status === "WON" && (
        <div className="mt-4 px-4 py-2 bg-green-700 text-white rounded text-sm font-bold">
          Nice job!
        </div>
      )}
      {session?.status === "LOST" && (
        <div className="mt-4 px-4 py-2 bg-red-700 text-white rounded text-sm font-bold">
          Better luck tomorrow! The word was {session.word?.toUpperCase()}
        </div>
      )}

      {/* Board */}
      <div className="flex grow items-center justify-center py-8">
        <Board
          guesses={session?.guesses ?? []}
          currentGuess={currentGuess}
          gameStatus={session?.status ?? "IN_PROGRESS"}
        />
      </div>

      {/* Keyboard */}
      <div className="w-full max-w-lg px-2 pb-8">
        <Keyboard
          letterStates={letterStates}
          onLetter={addLetter}
          onEnter={submitGuess}
          onDelete={deleteLetter}
        />
      </div>

      {/* Stats modal */}
      {showStats && stats && (
        <StatsModal stats={stats} onClose={() => setShowStats(false)} />
      )}
    </main>
  );
}
