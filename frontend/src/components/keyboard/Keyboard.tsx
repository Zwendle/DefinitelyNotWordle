import type { LetterResult } from "../../types/index";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const keyColor: Record<LetterResult, string> = {
  correct: "bg-green-600 text-white",
  present: "bg-yellow-500 text-white",
  absent: "bg-neutral-600 text-white",
};

interface KeyProps {
  label: string;
  state?: LetterResult;
  onPress: (key: string) => void;
}

function Key({ label, state, onPress }: KeyProps) {
  const isWide = label === "ENTER" || label === "⌫";
  const baseStyles =
    "flex items-center justify-center rounded font-bold uppercase cursor-pointer select-none transition-colors duration-200 active:scale-95";
  const sizeStyles = isWide
    ? "h-14 px-3 text-sm min-w-[4rem]"
    : "h-14 w-10 text-sm";
  const colorStyles = state
    ? keyColor[state]
    : "bg-neutral-400 text-neutral-900";

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${colorStyles}`}
      onClick={() => onPress(label)}
    >
      {label}
    </button>
  );
}

interface KeyboardProps {
  letterStates: Record<string, LetterResult>;
  onLetter: (letter: string) => void;
  onEnter: () => void;
  onDelete: () => void;
}

export default function Keyboard({
  letterStates,
  onLetter,
  onEnter,
  onDelete,
}: KeyboardProps) {
  function handleKeyPress(key: string) {
    if (key === "ENTER") onEnter();
    else if (key === "⌫") onDelete();
    else onLetter(key);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((key) => (
            <Key
              key={key}
              label={key}
              state={letterStates[key]}
              onPress={handleKeyPress}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
