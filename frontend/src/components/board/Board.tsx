import type { Guess, LetterResult } from "../../types/index";

const TILE_COUNT = 6;
const WORD_LENGTH = 5;

const tileColor: Record<LetterResult, string> = {
  correct: "bg-green-600 border-green-600 text-white",
  present: "bg-yellow-500 border-yellow-500 text-white",
  absent: "bg-neutral-600 border-neutral-600 text-white",
};

interface TileProps {
  letter?: string;
  result?: LetterResult;
  isActive?: boolean;
}

function Tile({ letter, result, isActive }: TileProps) {
  const baseStyles =
    "w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold uppercase transition-colors duration-300";

  const colorStyles = result
    ? tileColor[result]
    : letter
      ? "border-neutral-400 text-white bg-transparent"
      : "border-neutral-600 text-white bg-transparent";

  const scaleStyles = isActive && letter ? "scale-105" : "scale-100";

  return (
    <div className={`${baseStyles} ${colorStyles} ${scaleStyles}`}>
      {letter ?? ""}
    </div>
  );
}

interface BoardProps {
  guesses: Guess[];
  currentGuess: string;
  gameStatus: string;
}

export default function Board({ guesses, currentGuess }: BoardProps) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: TILE_COUNT }).map((_, rowIndex) => {
        const guess = guesses[rowIndex];
        const isCurrentRow = !guess && rowIndex === guesses.length;
        const letters = isCurrentRow
          ? currentGuess.padEnd(WORD_LENGTH).split("")
          : guess
            ? guess.word.split("")
            : Array(WORD_LENGTH).fill("");

        return (
          <div key={rowIndex} className="flex gap-2">
            {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
              const letter = letters[colIndex]?.trim() || undefined;
              const result = guess?.result[colIndex];

              return (
                <Tile
                  key={colIndex}
                  letter={letter}
                  result={result}
                  isActive={isCurrentRow}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
