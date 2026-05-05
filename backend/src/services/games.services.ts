import prisma from "../lib/prisma.js";

type LetterResult = "correct" | "present" | "absent";

export default class GamesService {
  static getTodayWordIndex(): number {
    const launch = new Date("2026-01-01");
    const today = new Date();
    const diff = Math.floor(
      (today.getTime() - launch.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff % 2309;
  }

  static scoreGuess(guess: string, answer: string): LetterResult[] {
    const result: LetterResult[] = Array(5).fill("absent");
    const answerLetters = answer.split("");
    const guessLetters = guess.split("");
    const used = Array(5).fill(false);

    // look for correct (green) letters first
    for (let i = 0; i < 5; i++) {
      if (guessLetters[i] === answerLetters[i]) {
        result[i] = "correct";
        used[i] = true;
      }
    }

    // look for present (yellow) letters next, skipping any already marked as correct
    for (let i = 0; i < 5; i++) {
      if (result[i] === "correct") continue;

      for (let j = 0; j < 5; j++) {
        if (!used[j] && guessLetters[i] === answerLetters[j]) {
          result[i] = "present";
          used[j] = true;
          break;
        }
      }
    }

    return result;
  }

  static async getOrCreateTodaySession(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingSession = await prisma.gameSession.findFirst({
      where: {
        userId,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      include: { guesses: { orderBy: { guessNumber: "asc" } } },
    });

    if (existingSession) return existingSession;

    const wordIndex = GamesService.getTodayWordIndex();
    const word = await prisma.word.findFirst({ where: { index: wordIndex } });

    if (!word) throw new Error("Word not found for today");

    return prisma.gameSession.create({
      data: { userId, wordId: word.id },
      include: { guesses: true },
    });
  }

  static async getOrCreateUser(sessionId: string) {
    const existing = await prisma.user.findUnique({ where: { sessionId } });
    if (existing) return existing;
    return prisma.user.create({ data: { sessionId } });
  }

  static async postGuess(userId: string, guess: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const session = await prisma.gameSession.findFirst({
      where: {
        userId,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      include: { guesses: true, word: true },
    });

    if (!session) throw new Error("No active game session found");
    if (session.status !== "IN_PROGRESS")
      throw new Error("Game is already over");

    const normalizedGuess = guess.toUpperCase();

    if (normalizedGuess.length !== 5)
      throw new Error("Guess must be exactly 5 letters");

    const validWord = await prisma.word.findFirst({
      where: { word: normalizedGuess },
    });
    if (!validWord) throw new Error("Not a valid word");

    const result = GamesService.scoreGuess(normalizedGuess, session.word.word);
    const guessNumber = session.guesses.length + 1;

    await prisma.guess.create({
      data: {
        gameSessionId: session.id,
        guessNumber,
        word: normalizedGuess,
        result,
      },
    });

    const won = result.every((r) => r === "correct");
    const lost = !won && guessNumber >= 6;

    if (won || lost) {
      await prisma.gameSession.update({
        where: { id: session.id },
        data: { status: won ? "WON" : "LOST" },
      });
    }

    return {
      result,
      guessNumber,
      status: won ? "WON" : lost ? "LOST" : "IN_PROGRESS",
    };
  }
}
