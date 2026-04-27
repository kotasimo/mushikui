import { useEffect, useState } from "react";
import "./App.css";
import { createQuestion, type Question } from "./createQuestion";
import { courses, type Course } from "./courses";

const BEST_SCORE_KEY = "mushikui_best_score";


export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [question, setQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    return Number(localStorage.getItem(BEST_SCORE_KEY) ?? 0);
  });
  const [missCount, setMissCount] = useState(0);
  const [course, setCourse] = useState<Course | null>(null);

  function start(selectedCourse: Course) {
  setCourse(selectedCourse);
  setIsPlaying(true);
  setTimeLeft(selectedCourse.seconds ?? 0);
  setCorrectCount(0);
  setMissCount(0);
  setInput("");
  setIsFinished(false);
  setQuestion(createQuestion(0));
}

  function answer(value: string) {
    if (isFinished) return;

    setInput((prev) => prev + value);
  }

  function submit() {
    if (!question || isFinished) return;
    if (input === "") return;

    if (Number(input) === question.answer) {
      const nextCount = correctCount + 1;
      setCorrectCount(nextCount);
      setQuestion(createQuestion(nextCount));
    } else {
      setQuestion(createQuestion(correctCount));
      setMissCount((prev) => prev + 1);
    }

    setInput("");
  }

  function endGame() {
    setIsPlaying(false);
    setIsFinished(false);
    setInput("");
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isPlaying || isFinished) return;

      if (/^[0-9]$/.test(e.key)) {
        answer(e.key);
      }

      if (e.key === "Enter") {
        submit();
      }

      if (e.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isFinished, input, question, correctCount]);

  useEffect(() => {
    if (!isPlaying || isFinished) return;
    if (course?.seconds === null) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setIsFinished(true);

          setBestScore((prev) => {
            if (correctCount > prev) {
              localStorage.setItem(BEST_SCORE_KEY, String(correctCount));
              return correctCount;
            }
            return prev;
          });

          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isFinished, correctCount, course]);

  if (!isPlaying) {
    return (
      <main className="screen">
        <h1>虫食い算</h1>
        <div>最高: {bestScore} 問</div>
        {courses.map((course) => (
          <button key={course.label} onClick={() => start(course)}>
            {course.label}
          </button>
        ))}
      </main>
    );
  }

  if (isFinished) {
    return (
      <main className="screen">
        <h1>結果</h1>
        <div className="score">{correctCount} 問</div>
        <div className="miss">{missCount} 問ミス</div>

        {course && <button onClick={() => start(course)}>もう一回</button>}
        <button onClick={() => setIsPlaying(false)}>ホーム</button>
      </main>
    );
  }


  return (
    <main className="screen">
      <div>{course?.seconds === null ? "練習" : `${timeLeft} 秒`}</div>

      <div className="question">{question?.text}</div>
      <div className="input">{input || "_"}</div>
      <button onClick={endGame}>終了</button>

    </main>
  );
}