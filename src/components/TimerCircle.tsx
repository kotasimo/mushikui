import "./TimerCircle.css";

type Props = {
  timeLeftMs: number;
  totalTimeMs: number;
};

export function TimerCircle({ timeLeftMs, totalTimeMs }: Props) {
  const r = 45;
  const circumference = 2 * Math.PI * r;
  const ratio = timeLeftMs / totalTimeMs;

  return (
    <div className="timer-circle">
      <svg className="timer-svg">
        <circle className="timer-bg" cx="50" cy="50" r={r} />
        <circle
          className="timer-progress"
          cx="50"
          cy="50"
          r={r}
          strokeDasharray={circumference}
          strokeDashoffset={ratio * circumference}
        />
      </svg>

      <div className="timer-text">
        {Math.ceil(timeLeftMs / 1000)}
      </div>
    </div>
  );
}