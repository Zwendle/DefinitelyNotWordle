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
      });
    } catch (error) {
      next(error);
    }
  }
}
