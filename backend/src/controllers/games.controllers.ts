import type { NextFunction, Request, Response } from "express";
import GamesService from "../services/games.services.js";

export default class GameController {
  static async getTodayGame(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.session.id;
      const user = await GamesService.getOrCreateUser(sessionId);
      const game = await GamesService.getOrCreateTodaySession(user.id);

      res.json({
        sessionId: game.id,
        status: game.status,
        guesses: game.guesses,
        word: game.status === 'LOST' ? game.word.word : undefined,
      });
    } catch (error) {
      next(error);
    }
  }

  static async postGuess(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.session.id;
      const user = await GamesService.getOrCreateUser(sessionId);
      const { guess } = req.body;

      if (!guess) {
        res.status(400).json({ message: "Guess is required" });
        return;
      }

      const result = await GamesService.postGuess(user.id, guess);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.session.id;
      const user = await GamesService.getOrCreateUser(sessionId);
      const stats = await GamesService.getStats(user.id);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}
