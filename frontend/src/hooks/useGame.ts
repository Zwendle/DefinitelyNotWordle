/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { getTodayGame, postGuess, getStats } from "../api/game";
import type { GameSession, GameStats, LetterResult } from "../types/index";
import axios from "axios";

export default function useGame() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initGame() {
      try {
        const data = await getTodayGame();
        setSession(data);
      } catch (e) {
        setError("Failed to load game. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    initGame();
  }, []);

  const submitGuess = useCallback(async () => {
    if (currentGuess.length !== 5) return;
    if (!session || session.status !== "IN_PROGRESS") return;

    setError(null);

    try {
      const res = await postGuess(currentGuess);

      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: res.status as GameSession["status"],
          guesses: [
            ...prev.guesses,
            {
              id: crypto.randomUUID(),
              gameSessionId: prev.sessionId,
              guessNumber: res.guessNumber,
              word: currentGuess.toUpperCase(),
              result: res.result,
            },
          ],
        };
      });

      setCurrentGuess("");
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message ?? "Something went wrong.");
      } else {
        setError("Something went wrong.");
      }
    }
  }, [currentGuess, session]);

  const addLetter = useCallback(
    (letter: string) => {
      if (currentGuess.length >= 5) return;
      if (session?.status !== "IN_PROGRESS") return;
      setCurrentGuess((prev) => prev + letter);
    },
    [currentGuess, session],
  );

  const deleteLetter = useCallback(() => {
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (e) {
      setError("Failed to load stats.");
    }
  }, []);

  // Derive keyboard letter states from guesses
  const letterStates =
    session?.guesses.reduce<Record<string, LetterResult>>((acc, guess) => {
      guess.result.forEach((result, i) => {
        const letter = guess.word[i];
        if (!letter) return;
        const current = acc[letter];
        if (current === "correct") return;
        if (current === "present" && result !== "correct") return;
        acc[letter] = result;
      });
      return acc;
    }, {}) ?? {};

  return {
    session,
    stats,
    currentGuess,
    error,
    isLoading,
    letterStates,
    addLetter,
    deleteLetter,
    submitGuess,
    fetchStats,
  };
}
