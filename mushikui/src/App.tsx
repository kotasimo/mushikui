import "./App.css";
import { courses } from "./courses";
import { useMushikuiGame } from "./useGame";
import { useSurvivalGame } from "./suvival";
import { TimerCircle } from "./components/TimerCircle";
import { useState, useEffect } from "react";
import { useChallengeGame } from "./useChallenge";
import { challengeCourses } from "./challenge";
import { ResultScreen } from "./components/result";
import { GameScreen } from "./components/gamescreen";
import { TimerView } from "./components/TimeView";
import { MenuButton } from "./components/MenuButton";
import { AnswerLogScreen } from "./components/AnswerLogScreen";
import { AnswerLogTable } from "./components/AnswerLogTable";
import { monsters } from "./monster";


export default function App() {
  const survival = useSurvivalGame();
  const game = useMushikuiGame();
  const challenge = useChallengeGame();

  const [screen, setScreen] = useState<
    | "home"
    | "time-select"
    | "survival-select"
    | "challenge-select"
    | "survival-log"
    | "game-log"
    | "challenge-log"
    | "practice-log"
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


  if (challenge.countdown !== null) {
    return (
      <main className="screen">
        <div className="countdown">{challenge.countdown}</div>
      </main>
    );
  }


  if (screen === "survival-log") {
    return (
      <AnswerLogScreen
        logs={survival.answerLogs}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "game-log") {
    return (
      <AnswerLogScreen
        logs={game.answerLogs}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "challenge-log") {
    return (
      <AnswerLogScreen
        logs={challenge.answerLogs}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "practice-log") {
    return (
      <AnswerLogScreen
        logs={game.answerLogs}
        onBack={() => {
          game.resumeGame();
          setScreen("home");
        }}
      />
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

  const challengeLevel =
    challenge.currentCourse?.levels[
    challenge.currentCourse.levels.length - 1
    ];

  const monster = challengeLevel !== undefined
    ? monsters[challengeLevel]
    : undefined;

  if (challenge.isPlaying || challenge.countdown !== null) {
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
        countdown={challenge.countdown}
      >
        {/* 👇 ここが children */}
        <div className="monster-area">
          {/* タイマー（上に重ねる） */}
          <div className="timer">{challenge.timeLeft}s</div>

          {/* モンスター */}
          <img src={monster} className="monster-big" />

          {/* HP（下に重ねる） */}
          <div className="hp-bar">
            <div
              className="hp-fill"
              style={{
                width: `${challenge.currentCourse
                  ? (challenge.remaining /
                    challenge.currentCourse.questionCount) *
                  100
                  : 100
                  }%`,
              }}
            />
          </div>
        </div>
      </GameScreen>
    );
  }

  if (survival.isFinished) {
    return (
      <ResultScreen
        onRetry={survival.startGame}
        onHome={() => {
          survival.goHome();
          setScreen("home");
        }}
      >
        <div className="result-score-main">
          {survival.correctCount}
        </div>

        <div className="result-best">
          Best {survival.bestScore}
        </div>

        <AnswerLogTable logs={survival.answerLogs} />
      </ResultScreen>
    );
  }

  if (game.isFinished) {
    return (
      <ResultScreen
        onRetry={game.course ? () => game.start(game.course!) : undefined}
        onHome={() => {
          game.goHome();
          setScreen("home");
        }}
      >
        <div className="result-score-main">
          {game.correctCount}
        </div>

        <div className="result-best">
          Best {game.bestScore}
        </div>

        <AnswerLogTable logs={game.answerLogs} />
      </ResultScreen>
    );
  }

  if (challenge.isFinished) {
    const clearTime =
      challenge.currentCourse
        ? challenge.currentCourse.timeLimit - challenge.timeLeft
        : 0;

    return (
      <ResultScreen
        title={challenge.remaining === 0 ? "CLEAR" : "FAILED"}
        timeText={`${clearTime}s`}
        onRetry={() => {
          if (challenge.currentCourse) {
            challenge.startGame(challenge.currentCourse);
          }
        }}
        onCourses={() => {
          challenge.goHome();
          setScreen("challenge-select");
        }}
        onHome={() => {
          challenge.goHome();
          setScreen("home");
        }}
      >
        <AnswerLogTable logs={challenge.answerLogs} />
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

        <button className="back-button" onClick={() => setScreen("home")}>Back</button>
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
        <button className="back-button" onClick={() => setScreen("home")}>Back</button>
      </main>
    );
  }

  if (!game.isPlaying && screen === "challenge-select") {
    return (
      <main className="screen">
        <h1>Challenge</h1>

        <div className="challenge-list">
          {challengeCourses.map((course) => {
            const best = challenge.getBest(course.id);

            const level = course.levels[course.levels.length - 1];
            const monster = monsters[level];

            return (
              <div key={course.id} className="challenge-card">
                <button
                  className="challenge-card-button"
                  onClick={() => challenge.startGame(course)}
                >
                  <span className="challenge-card-left">
                    <span>{course.label}</span>
                    <img src={monster} className="monster-icon" />
                  </span>

                  <span className="challenge-card-right">
                    {best.cleared ? "✓" : "—"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <button className="back-button" onClick={() => setScreen("home")}>Back</button>
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

      {game.course?.id === "practice" && (
        <button
          className="history-button"
          onClick={() => {
            console.log("履歴ボタン押した");
            game.pauseGame();
            setScreen("practice-log");
          }}
        >
          履歴
        </button>
      )}
    </GameScreen>
  );
}
