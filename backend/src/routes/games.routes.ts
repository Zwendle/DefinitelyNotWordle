import express from 'express';
import GameController from '../controllers/games.controllers.js';

const gameRouter = express.Router();

gameRouter.get('/today', GameController.getTodayGame);

export default gameRouter;