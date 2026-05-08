type ScoreBoxProps = {
  correct: number;
  miss: number;
  flashMiss?: boolean;
};

export function ScoreBox({ correct, miss, flashMiss = false }: ScoreBoxProps) {
  return (
    <div className="score-box">
      <div className="correct">{correct} ✓</div>
      <div className={`miss ${flashMiss ? "flash" : ""}`}>
        {miss} ✖
      </div>
    </div>
  );
}