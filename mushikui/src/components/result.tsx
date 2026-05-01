type ResultScreenProps = {
  title?: string; // CLEAR / FAILED
  timeText?: string;
  children?: React.ReactNode;

  onRetry?: () => void;
  onHome: () => void;
  onCourses?: () => void;
};

export function ResultScreen({
  title,
  timeText,
  children,
  onRetry,
  onHome,
  onCourses,
}: ResultScreenProps) {
  return (
    <main className="result-screen">
      <div className="result-top-buttons">
        {onCourses && <button onClick={onCourses}>Courses</button>}
        <button onClick={onHome}>Home</button>
      </div>

      <div className="result-header">
        {title && <h1 className="result-title">{title}</h1>}

        {timeText && <div className="result-time">{timeText}</div>}

       
      </div>

      <div className="result-history">
        {children}
      </div>
       {onRetry && (
          <button className="result-retry-button" onClick={onRetry}>
            Try again
          </button>
        )}
    </main>
  );
}