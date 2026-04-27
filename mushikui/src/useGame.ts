import { useEffect, useState } from "react";
import { createQuestion, type Question } from "./createQuestion";
import type { Course } from "./courses";

const BEST_SCORE_KEY = "mushikui_best_score";

export function useMushikuiGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);

  const [bestScore, setBestScore] = useState(() => {
    return Number(localStorage.getItem(BEST_SCORE_KEY) ?? 0);
  });

  // --- start ---
  function start(selectedCourse: Course) {
    setCourse(selectedCourse);
    setIsPlaying(true);
    setTimeLeft(selectedCourse.seconds ?? 0);
    setCorrectCount(0);
    setMissCount(0);
    setInput("");
    setIsFinished(false);
    setQuestion(createQuestion(0, selectedCourse));
  }

  // --- 入力 ---
  function answer(value: string) {
    if (isFinished) return;
    setInput((prev) => prev + value);
  }

  // --- 判定 ---
  function submit() {
    if (!question || isFinished) return;
    if (input === "") return;

    if (Number(input) === question.answer) {
      const next = correctCount + 1;
      setCorrectCount(next);
      setQuestion(createQuestion(next, course ?? undefined));
    } else {
      setMissCount((prev) => prev + 1);
      setQuestion(createQuestion(correctCount, course ?? undefined));
    }

    setInput("");
  }

  // --- 終了 ---
  function endGame() {
    setIsPlaying(false);
    setIsFinished(false);
    setInput("");
  }

  function goHome() {
    setIsPlaying(false);
    setIsFinished(false);
  }

  // --- キーボード ---
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isPlaying || isFinished) return;

      if (/^[0-9]$/.test(e.key)) answer(e.key);
      if (e.key === "Enter") submit();
      if (e.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isFinished, input, question, correctCount]);

  // --- タイマー ---
  useEffect(() => {
    if (!isPlaying || isFinished || !course) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        // 練習（カウントアップ）
        if (course.id === "practice") {
          return t + 1;
        }

        // タイム制（カウントダウン）
        if (t <= 1) {
          clearInterval(timer);
          setIsFinished(true);

          setBestScore((prev) => {
            if (correctCount > prev) {
              localStorage.setItem(
                BEST_SCORE_KEY,
                String(correctCount)
              );
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

  return {
    // 状態
    isPlaying,
    isFinished,
    timeLeft,
    question,
    input,
    correctCount,
    missCount,
    bestScore,
    course,

    // 操作
    start,
    answer,
    submit,
    endGame,
    goHome,
  };
}