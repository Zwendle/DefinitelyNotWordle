import express from "express";
import GameController from "../controllers/games.controllers.js";

const gameRouter = express.Router();

gameRouter.get("/today", GameController.getTodayGame);

gameRouter.post("/guess", GameController.postGuess);

gameRouter.get("/stats", GameController.getStats);

export default gameRouter;
