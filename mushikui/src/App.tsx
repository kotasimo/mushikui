import "./App.css";
import { courses } from "./courses";
import { useMushikuiGame } from "./useGame";
import { NewBestScreen } from "./components/bestScreen";

export default function App() {
  const game = useMushikuiGame();

  if (game.countdown !== null) {
    return (
      <main className="screen">
        <div className="countdown">{game.countdown}</div>
      </main>
    );
  }

  if (game.isFinished && game.isNewBest && game.course) {
    return (
      <NewBestScreen
        score={game.correctCount}
        onRetry={() => game.start(game.course!)}
        onHome={game.goHome}
      />
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

  if (!game.isPlaying) {
    return (
      <main className="screen">
        <h1>虫食い算</h1>
        <div className="menu-grid">
          {courses.map((course) => {
            const best = game.bestScores[course.id] ?? 0;

            return (
              <div key={course.id} className="menu-item">
                <button onClick={() => game.start(course)}>
                  {course.label}
                </button>

                {course.id !== "practice" && (
                  <div className="best">最高: {best}問</div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    );
  }

  return (
    <main className="game-screen">
      <div className="score-box">
        <div className="score-text">
          {game.correctCount} 正解 / {game.missCount} ミス
        </div>

        {game.course?.id === "practice" && (
          <button className="reset-btn" onClick={game.resetPractice}>
            ↺
          </button>
        )}
      </div>

      <div className="game-center">
        {game.course?.id === "practice" ? (
          <div className="timer">
            <span>{game.timeLeft}秒</span>
            <span>{game.correctCount + game.missCount}問</span>
          </div>
        ) : (
          <div>{game.timeLeft} 秒</div>
        )}

        <div className="question">{game.question?.text}</div>
        <div className="input">{game.input || ""}</div>

        <button onClick={game.endGame}>終了</button>
      </div>
    </main>
  );
}