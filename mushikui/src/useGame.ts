import { useEffect, useState } from "react";
import { createQuestion, type Question } from "./createQuestion";
import type { Course } from "./courses";

const BEST_SCORES_KEY = "mushikui_best_score";

export function useMushikuiGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [bestScores, setBestScores] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(BEST_SCORES_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const bestScore = course ? bestScores[course.id] ?? 0 : 0;

  // --- start ---
  function start(selectedCourse: Course) {
    setCourse(selectedCourse);
    setTimeLeft(selectedCourse.seconds ?? 0);
    setCorrectCount(0);
    setMissCount(0);
    setInput("");
    setIsFinished(false);
    setQuestion(createQuestion(0, selectedCourse));

    setCountdown(3);
    setIsPlaying(false);
    setIsNewBest(false);
  }
  
  function deleteOne() {
  setInput((prev) => prev.slice(0, -1));
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
      if (!isPlaying || isFinished || isPaused) return;

      if (/^[0-9]$/.test(e.key)) answer(e.key);
      if (e.key === "Enter") submit();
      if (e.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      }
      if (e.key === " ") {
        e.preventDefault(); // スクロール防止
        setIsPaused((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isFinished, input, question, correctCount]);

  // --- タイマー ---
  // --- タイマー ---
  useEffect(() => {
    if (!isPlaying || isFinished || !course || isPaused) return;

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
          return 0;
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isFinished, course, isPaused]);

  // --- ベストスコア保存 ---
  useEffect(() => {
    if (!isFinished || !course) return;
    if (course.id === "practice") return;

    setBestScores((prev) => {
      const prevBest = prev[course.id] ?? 0;

      if (correctCount <= prevBest) return prev;

      const next = {
        ...prev,
        [course.id]: correctCount,
      };

      localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(next));
      setIsNewBest(true);
      return next;
    });
  }, [isFinished, course, correctCount]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      setIsPlaying(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev === null ? null : prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

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
    bestScores,
    course,
    countdown,
    isNewBest,
    isPaused,

    // 操作
    start,
    answer,
    submit,
    endGame,
    goHome,
    deleteOne,
  };
}