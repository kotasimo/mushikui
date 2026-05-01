import { MobileKeypad } from "./MobileKeypad";

type GameScreenProps = {
  question: string | undefined;
  input: string;
  correct: number;
  miss: number;
  onFinish: () => void;
  children?: React.ReactNode;
  onNumber?: (n: number) => void;
  onDelete?: () => void;
  onSubmit?: () => void;
  togglePause?: () => void;
  isPaused?: boolean;
};

export function GameScreen({
  question,
  input,
  correct,
  miss,
  onFinish,
  children,
  onNumber,
  onDelete,
  onSubmit,
  togglePause,
  isPaused,
}: GameScreenProps) {
  const isMobile = window.innerWidth <= 768;

  return (
    <main className="game-screen">
      <button className="finish-button" onClick={onFinish}>
        finish
      </button>

      {isPaused && <div className="paused">STOP</div>}

      <div className="game-center">
        {/* 👇 ここに差し込む */}
        {children}

        <div className="question">{question}</div>
        <div className="input">{input || ""}</div>

        {isMobile && onNumber && onDelete && onSubmit && togglePause && (
          <MobileKeypad
            onNumber={onNumber}
            onDelete={onDelete}
            onSubmit={onSubmit}
            togglePause={togglePause}
            isPaused={isPaused ?? false}
          />
        )}

        <div className="score-box">
          <div className="correct">{correct} ✓</div>
          <div className="miss">{miss} ✖</div>
        </div>
      </div>
    </main>
  );
}
