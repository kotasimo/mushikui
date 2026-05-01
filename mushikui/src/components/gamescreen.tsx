import { MobileKeypad } from "./MobileKeypad";

type Props = {
  question: string | undefined;
  input: string;
  correct: number;
  miss: number;
  flashMiss?: boolean;

  onFinish: () => void;
  onNumber: (n: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
  togglePause: () => void;
  isPaused: boolean;

  children?: React.ReactNode;
};

export function GameScreen({
  question,
  input,
  correct,
  miss,
  flashMiss = false,
  onFinish,
  onNumber,
  onDelete,
  onSubmit,
  togglePause,
  isPaused,
  children,
}: Props) {
  const isMobile = window.innerWidth <= 768;

  return (
    <main className="game-screen">
      {/* finishボタン */}
      <button className="finish-button" onClick={onFinish}>
        finish
      </button>

      {/* pause表示 */}
      {isPaused && <div className="paused">STOP</div>}

      <div className="game-center">
        {/* 👇 モードごとの差し込み */}
        {children}

        <div className="question">{question}</div>
        <div className="input">{input || ""}</div>

        {/* keypad */}
        {isMobile && (
          <MobileKeypad
            onNumber={onNumber}
            onDelete={onDelete}
            onSubmit={onSubmit}
            togglePause={togglePause}
            isPaused={isPaused}
          />
        )}

        {/* score */}
        <div className="score-box">
          <div className="correct">{correct} ✓</div>
          <div className={`miss ${flashMiss ? "flash" : ""}`}>
            {miss} ✖
          </div>
        </div>
      </div>
    </main>
  );
}