import "./App.css";
import { courses } from "./courses";
import { useMushikuiGame } from "./useGame";
import { NewBestScreen } from "./components/bestScreen";
import { MobileKeypad } from "./components/MobileKeypad";
import { useSurvivalGame } from "./suvival";

export default function App() {
  const survival = useSurvivalGame();

  const game = useMushikuiGame();

  const isMobile = window.innerWidth <= 768;

  if (game.countdown !== null) {
    return (
      <main className="screen">
        <div className="countdown">{game.countdown}</div>
      </main>
    );
  }

  if (survival.isPlaying) {
    return (
      <main className="game-screen">
        <div className="score-box">
          <div className="score-text">
            {survival.correctCount} 正解 / {survival.missCount} ミス
          </div>
        </div>



        {survival .isPaused && <div className="paused">STOP</div>}

        <div className="game-center">
          <div>{Math.ceil(survival.timeLeftMs / 1000)} 秒</div>

          <div className="question">{survival.question?.text}</div>
          <div className="input">{survival.input || ""}</div>

          {isMobile && (
            <MobileKeypad
              onNumber={(n) => survival.answer(n)}
              onDelete={() => survival.deleteOne()}
              onSubmit={survival.submit}
              togglePause={survival.togglePause}
              isPaused={survival.isPaused}
            />
          )}

          <button onClick={survival.endGame}>終了</button>
        </div>
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

        <div className="menu-item">
          <button onClick={survival.startGame}>
            サバイバル
          </button>
          <div className="best">最高: {survival.bestScore}問</div>
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

        {game.isPaused && <div className="paused">STOP</div>}

        <div className="question">{game.question?.text}</div>
        <div className="input">{game.input || ""}</div>

        {isMobile && (
          <MobileKeypad
            onNumber={game.answer}
            onDelete={game.deleteOne}
            onSubmit={game.submit}
            togglePause={game.togglePause}
            isPaused={game.isPaused}
          />
        )}

        <button onClick={game.endGame}>終了</button>
      </div>
    </main>
  );
}