type Props = {
  score: number;
  onRetry: () => void;
  onHome: () => void;
};

export function NewBestScreen({ score, onRetry, onHome }: Props) {
  return (
    <main className="screen">
      <div className="new-best-title">🎉 最高記録更新！</div>
      <div className="new-best-score">{score} 問</div>

      <button onClick={onRetry}>もう一回</button>
      <button onClick={onHome}>ホーム</button>
    </main>
  );
}