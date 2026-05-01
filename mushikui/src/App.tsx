import "./App.css";
import { courses } from "./courses";
import { useMushikuiGame } from "./useGame";
import { NewBestScreen } from "./components/bestScreen";
import { useSurvivalGame } from "./suvival";
import { TimerCircle } from "./components/TimerCircle";
import { useState, useEffect } from "react";
import { useChallengeGame } from "./useChallenge";
import { challengeCourses } from "./challenge";
import { ResultScreen } from "./components/result";
import { GameScreen } from "./components/gamescreen";
import { TimerView } from "./components/TimeView";
import { MenuButton } from "./components/MenuButton";

export default function App() {
  const survival = useSurvivalGame();
  const game = useMushikuiGame();
  const challenge = useChallengeGame();

  const [screen, setScreen] = useState<
    "home" | "time-select" | "survival-select" | "challenge-select"
  >("home");
  const [flashMiss, setFlashMiss] = useState(false);

  function handleGameNumber(n: number) {
    game.answer(String(n));
  }

  function handleSurvivalNumber(n: number) {
    survival.answer(String(n));
  }

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
      <GameScreen
        question={survival.question?.text}
        input={survival.input}
        correct={survival.correctCount}
        miss={survival.missCount}
        onFinish={survival.endGame}
        onNumber={handleSurvivalNumber}
        onDelete={survival.deleteOne}
        onSubmit={survival.submit}
        togglePause={survival.togglePause}
        isPaused={survival.isPaused}
        flashMiss={flashMiss}
      >
        <TimerCircle
          timeLeftMs={survival.timeLeftMs}
          totalTimeMs={survival.answerTimeMs}
        />
      </GameScreen>
    );
  }

  if (challenge.isPlaying) {
    return (
      <GameScreen
        question={challenge.question?.text}
        input={challenge.input}
        correct={challenge.correctCount}
        miss={challenge.missCount}
        onFinish={challenge.endGame}
        onNumber={challenge.answer}
        onDelete={challenge.deleteOne}
        onSubmit={challenge.submit}
        togglePause={challenge.togglePause}
        isPaused={challenge.isPaused}
        flashMiss={flashMiss}
      >
        {/* 👇 ここが children */}
        <div className="timer">{challenge.timeLeft}s</div>
        <div className="remaining">{challenge.remaining} left</div>
      </GameScreen>
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
      <ResultScreen onRetry={survival.startGame} onHome={survival.goHome}>
        <div className="result-score">
          <div>Score: {survival.correctCount}</div>
          <div>Miss: {survival.missCount}</div>
        </div>

        <div>Best: {survival.bestScore}</div>
      </ResultScreen>
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
      <ResultScreen
        onRetry={game.course ? () => game.start(game.course!) : undefined}
        onHome={game.goHome}
      >
        <div className="result-score">
          <div className="score">Score: {game.correctCount}</div>
          <div className="miss">Miss: {game.missCount}</div>
        </div>

        <div className="best">Best: {game.bestScore}</div>
      </ResultScreen>
    );
  }

  if (challenge.isFinished) {
    return (
      <ResultScreen
        onRetry={() => {
          challenge.goHome();
          setScreen("challenge-select");
        }}
        onHome={() => {
          challenge.goHome();
          setScreen("home");
        }}
      >
        <div>{challenge.remaining === 0 ? "CLEAR" : "FAILED"}</div>
      </ResultScreen>
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
              <MenuButton
                key={course.id}
                label={course.label}
                info={`Best: ${best}`}
                onClick={() => game.start(course)}
              />
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
          <MenuButton label="タイム" onClick={() => setScreen("time-select")} />

          <MenuButton label="サバイバル" onClick={() => setScreen("survival-select")} />

          <MenuButton label="Challenge" onClick={() => setScreen("challenge-select")} />

          <MenuButton
            label="練習"
            onClick={() => game.start(courses.find((c) => c.id === "practice")!)}
          />
        </div>
      </main >
    );
  }

  if (!game.isPlaying && screen === "survival-select") {
    return (
      <main className="screen">
        <h1>サバイバル</h1>

        <div className="menu-grid">
          <MenuButton
            label="10s"
            info={`Best: ${survival.getBestScore(10000)}`}
            onClick={() => {
              survival.setAnswerTimeMs(10000);
              survival.startGame();
              setScreen("home");
            }}
          />

          <MenuButton
            label="5s"
            info={`Best: ${survival.getBestScore(5000)}`}
            onClick={() => {
              survival.setAnswerTimeMs(5000);
              survival.startGame();
              setScreen("home");
            }}
          />

          <MenuButton
            label="3s"
            info={`Best: ${survival.getBestScore(3000)}`}
            onClick={() => {
              survival.setAnswerTimeMs(3000);
              survival.startGame();
              setScreen("home");
            }}
          />
        </div>
        <button onClick={() => setScreen("home")}>Back</button>
      </main>
    );
  }

  if (!game.isPlaying && screen === "challenge-select") {
    return (
      <main className="screen">
        <h1>Challenge</h1>

        <div className="menu-list">
          {challengeCourses.map((course) => {
            const best = challenge.getBest(course.id);

            return (
              <div key={course.id} className="menu-row">
                <button
                  onClick={() => {
                    challenge.startGame(course);
                  }}
                >
                  {course.label}
                </button>

                <div className="menu-info">
                  {best.cleared ? (
                    <div className="clear">✓ {best.bestTime}s</div>
                  ) : (
                    <div className="not-clear">□ {best.bestCount}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => setScreen("home")}>Back</button>
      </main>
    );
  }

  return (
    <GameScreen
      question={game.question?.text}
      input={game.input}
      correct={game.correctCount}
      miss={game.missCount}
      onFinish={game.endGame}
      onNumber={handleGameNumber}
      onDelete={game.deleteOne}
      onSubmit={game.submit}
      togglePause={game.togglePause}
      isPaused={game.isPaused}
      flashMiss={flashMiss}
    >
      <TimerView
        timeLeft={game.timeLeft}
        count={
          game.course?.id === "practice"
            ? game.correctCount + game.missCount
            : undefined
        }
      />
    </GameScreen>
  );
}
