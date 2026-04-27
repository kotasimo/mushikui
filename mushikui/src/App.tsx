import "./App.css";
import { courses } from "./courses";
import { useMushikuiGame } from "./useGame";

export default function App() {
  const game = useMushikuiGame();

  if (!game.isPlaying) {
    return (
      <main className="screen">
        <h1>虫食い算</h1>
        <div>最高: {game.bestScore} 問</div>

        {courses.map((course) => (
          <button key={course.label} onClick={() => game.start(course)}>
            {course.label}
          </button>
        ))}
      </main>
    );
  }

  if (game.isFinished) {
    return (
      <main className="screen">
        <h1>結果</h1>
        <div className="score">{game.correctCount} 問</div>
        <div className="miss">{game.missCount} 問ミス</div>

        {game.course && (
          <button onClick={() => game.start(game.course!)}>もう一回</button>
        )}

        <button onClick={game.goHome}>ホーム</button>
      </main>
    );
  }

  return (
    <main className="screen">
      <div>
        {game.course?.id === "practice" ? (
          <div className="status">
            <div className="timer">{game.timeLeft} 秒   {game.correctCount + game.missCount} 問</div>
            <div>
              {game.correctCount} 正解 / {game.missCount} ミス
            </div>
          </div>
        ) : (
          <>
            <div>{game.timeLeft} 秒</div>
          </>
        )}
      </div>

      <div className="question">{game.question?.text}</div>
      <div className="input">{game.input || "_"}</div>

      <button onClick={game.endGame}>終了</button>
    </main>
  );
}