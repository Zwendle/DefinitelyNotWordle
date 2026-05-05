import prisma from "../lib/prisma.js";

export default class GamesService {
  static getTodayWordIndex(): number {
    const launch = new Date("2026-01-01");
    const today = new Date();
    const diff = Math.floor(
      (today.getTime() - launch.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff % 2309;
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
}
