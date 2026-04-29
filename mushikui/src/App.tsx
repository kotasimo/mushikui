import "./App.css";
import { courses } from "./courses";
import { useMushikuiGame } from "./useGame";
import { NewBestScreen } from "./components/bestScreen";
import { MobileKeypad } from "./components/MobileKeypad";
import { useSurvivalGame } from "./suvival";
import { TimerCircle } from "./components/TimerCircle";
import { useState, useEffect } from "react";

export default function App() {
  const survival = useSurvivalGame();
  const game = useMushikuiGame();
  const [screen, setScreen] = useState<
    "home" | "time-select" | "survival-select"
  >("home");
  const [flashMiss, setFlashMiss] = useState(false);


  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (survival.missCount === 0) return;

    setFlashMiss(true);

    const t = setTimeout(() => {
      setFlashMiss(false);
    }, 150); // 一瞬

    return () => clearTimeout(t);
  }, [survival.missCount]);

  if (game.countdown !== null) {
    return (
      <main className="screen">
        <div className="countdown">{game.countdown}</div>
      </main>
    );
  }

  if (survival.countdown !== null) {
    return (
      <main className="screen">
        <div className="countdown">{survival.countdown}</div>
      </main>
    );
  }


  if (survival.isPlaying) {
    return (
      <main className="game-screen">

        <button className="finish-button" onClick={survival.endGame}>finish</button>

        {survival.isPaused && <div className="paused">STOP</div>}

        <div className="game-center">

          <TimerCircle
            timeLeftMs={survival.timeLeftMs}
            totalTimeMs={survival.answerTimeMs}
          />

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

          <div className="score-box">
            <div className="correct">
              {survival.correctCount} ✓
            </div>

            <div className={`miss ${flashMiss ? "flash" : ""}`}>
              {survival.missCount} ✖
            </div>
          </div>


        </div>
      </main>
    );
  }

  if (survival.isFinished && survival.isNewBest) {
    return (
      <NewBestScreen
        score={survival.correctCount}
        onRetry={survival.startGame}
        onHome={game.goHome}
      />
    );
  }

  if (survival.isFinished) {
    return (
      <main className="screen">
        <h1>RESULT</h1>

        <div className="result-score">
          <div className="score">Score: {survival.correctCount}</div>
          <div className="miss">Miss: {survival.missCount}</div>
        </div>

        <div className="best">Best: {survival.bestScore}</div>

        <button onClick={survival.startGame}>Try again</button>
        <button onClick={survival.goHome}>HOME</button>
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
        <h1>RESULT</h1>
        <div className="score">{game.correctCount} score</div>
        <div className="miss">{game.missCount} miss</div>

        {game.course && (
          <button onClick={() => game.start(game.course!)}>Try again</button>
        )}

        <button onClick={game.goHome}>HOME</button>
      </main>
    );
  }

  if (!game.isPlaying && screen === "time-select") {
    const timeCourses = courses.filter((course) => course.id !== "practice");

    return (
      <main className="screen">
        <h1>Time Attack</h1>

        <div className="menu-grid">
          {timeCourses.map((course) => {
            const best = game.bestScores[course.id] ?? 0;

            return (
              <div key={course.id} className="menu-item">
                <button onClick={() => game.start(course)}>
                  {course.label}
                </button>
                <div className="best">Best: {best}</div>
              </div>
            );
          })}
        </div>

        <button onClick={() => setScreen("home")}>Back</button>
      </main>
    );
  }

  if (!game.isPlaying && screen === "home") {
    return (
      <main className="screen">
        <h1>虫食い算</h1>

        <div className="menu-grid">
          <div className="menu-item">
            <button onClick={() => setScreen("time-select")}>
              タイム
            </button>
          </div>

          <div className="menu-item">
            <button onClick={() => setScreen("survival-select")}>
              サバイバル
            </button>
          </div>

          <div className="menu-item">
            <button onClick={() => game.start(courses.find(c => c.id === "practice")!)}>
              練習
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!game.isPlaying && screen === "survival-select") {
    return (
      <main className="screen">
        <h1>サバイバル</h1>

        <div className="menu-grid">
          <div className="menu-item">
            <button
              onClick={() => {
                survival.setAnswerTimeMs(10000);
                survival.startGame();
                setScreen("home");
              }}
            >
              10s
            </button>
            <div className="best">Best: {survival.getBestScore(10000)}</div>
          </div>

          <div className="menu-item">
            <button
              onClick={() => {
                survival.setAnswerTimeMs(5000);
                survival.startGame();
                setScreen("home");
              }}
            >
              5s
            </button>
            <div className="best">Best: {survival.getBestScore(5000)}</div>
          </div>

          <div className="menu-item">
            <button
              onClick={() => {
                survival.setAnswerTimeMs(3000);
                survival.startGame();
                setScreen("home");
              }}
            >
              3s
            </button>
            <div className="best">Best: {survival.getBestScore(3000)}</div>
          </div>
        </div>

        <button onClick={() => setScreen("home")}>Back</button>
      </main>
    );
  }

  return (
    <main className="game-screen">

      <button className="finish-button" onClick={game.endGame}>finish</button>

      <div className="game-center">
        {game.course?.id === "practice" ? (
          <div className="timer">
            <span>{game.timeLeft}s</span>
            <span>{game.correctCount + game.missCount}問</span>
          </div>
        ) : (
          <div className="timer">{game.timeLeft}s</div>
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

        <div className="score-box">
          <div className="correct">
            {game.correctCount} ✓
          </div>

          <div className={`miss ${flashMiss ? "flash" : ""}`}>
            {game.missCount} ✖
          </div>
        </div>

      </div>
    </main>
  );
}