type ResultScreenProps = {
  title?: string;
  children?: React.ReactNode;
  onRetry?: () => void;
  onHome: () => void;
};

export function ResultScreen({
  title = "RESULT",
  children,
  onRetry,
  onHome,
}: ResultScreenProps) {
  return (
    <main className="screen">
      <h1>{title}</h1>

      {children}

      {onRetry && <button onClick={onRetry}>Try again</button>}
      <button onClick={onHome}>Home</button>
    </main>
  );
}