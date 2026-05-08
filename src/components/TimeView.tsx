type TimerViewProps = {
  timeLeft: number;
  count?: number;
};

export function TimerView({ timeLeft, count }: TimerViewProps) {
  if (count !== undefined) {
    return (
      <div className="timer">
        <span>{timeLeft}s</span>
        <span>{count}問</span>
      </div>
    );
  }

  return <div className="timer">{timeLeft}s</div>;
}