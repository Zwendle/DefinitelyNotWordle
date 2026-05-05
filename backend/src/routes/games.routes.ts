import express from "express";
import GameController from "../controllers/games.controllers.js";

const gameRouter = express.Router();

gameRouter.get("/today", GameController.getTodayGame);

gameRouter.post("/guess", GameController.postGuess);

export default gameRouter;
