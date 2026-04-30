import { useEffect, useState } from "react";
import { createQuestionByLevel, type Question } from "./createQuestion";
import type { ChallengeCourse } from "./challenge";

type ChallengeBest = {
  bestCount: number;
  bestTime: number | null; // クリア時の残り秒数
  cleared: boolean;
};

const getChallengeBestKey = (courseId: string) =>
  `mushikui_challenge_best_${courseId}`;

function loadChallengeBest(courseId: string): ChallengeBest {
  const saved = localStorage.getItem(getChallengeBestKey(courseId));

  if (!saved) {
    return {
      bestCount: 0,
      bestTime: null,
      cleared: false,
    };
  }

  return JSON.parse(saved);
}

function saveChallengeBest(courseId: string, best: ChallengeBest) {
  localStorage.setItem(getChallengeBestKey(courseId), JSON.stringify(best));
}

export function useChallengeGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 秒
  const [remaining, setRemaining] = useState(10); // 問題数
  const [question, setQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState("");
  const [currentCourse, setCurrentCourse] = useState<ChallengeCourse | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [missCount, setMissCount] = useState(0);

  function pick<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  function startGame(course: ChallengeCourse) {
    setIsPlaying(true);
    setIsFinished(false);
    setIsPaused(false);
    setTimeLeft(course.timeLimit);
    setRemaining(course.questionCount);
    setCurrentCourse(course);
    const level = pick(course.levels);
    setQuestion(createQuestionByLevel(level));
    setInput("");
    setCorrectCount(0);
    setMissCount(0);
  }

  function goHome() {
    setIsPlaying(false);
    setIsFinished(false);
    setIsPaused(false);
    setQuestion(null);
    setInput("");
    setRemaining(10);
    setTimeLeft(60);
    setCorrectCount(0);
    setMissCount(0);
  }

  function answer(n: string) {
    if (!isPlaying || isFinished || isPaused) return;
    setInput((prev) => prev + n);
  }

  function submit() {
    if (!question || !isPlaying || isFinished || isPaused) return;
    if (!currentCourse) return;

    const correct = Number(input) === question.answer;
    const level = pick(currentCourse.levels);
    setQuestion(createQuestionByLevel(level));

    if (correct) {
      setCorrectCount((prev) => prev + 1);
      setRemaining((prev) => prev - 1);
    } else {
      setMissCount((prev) => prev + 1);
    }

    setInput("");
  }

  function deleteOne() {
    setInput((prev) => prev.slice(0, -1));
  }

  function togglePause() {
    if (!isPlaying || isFinished) return;
    setIsPaused((prev) => !prev);
  }

  function endGame() {
    finishGame(correctCount, remaining, timeLeft);
  }

  function getBest(courseId: string): ChallengeBest {
    return loadChallengeBest(courseId);
  }

  function finishGame(finalCorrectCount: number, finalRemaining: number, finalTimeLeft: number) {
    if (!currentCourse) {
      finishGame(correctCount, remaining, 0);
      return 0;
    }

    const prev = loadChallengeBest(currentCourse.id);
    const cleared = finalRemaining <= 0;

    const next: ChallengeBest = {
      bestCount: Math.max(prev.bestCount, finalCorrectCount),
      bestTime: cleared
        ? prev.bestTime === null
          ? finalTimeLeft
          : Math.max(prev.bestTime, finalTimeLeft)
        : prev.bestTime,
      cleared: prev.cleared || cleared,
    };

    saveChallengeBest(currentCourse.id, next);

    setIsPlaying(false);
    setIsFinished(true);
  }

  // タイマー
  useEffect(() => {
    if (!isPlaying || isFinished || isPaused) return;

    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [isPlaying, isFinished, isPaused]);

  // クリア判定
  useEffect(() => {
    if (remaining <= 0 && isPlaying) {
      finishGame(correctCount, 0, timeLeft);
    }
  }, [remaining]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isPlaying || isFinished) return;

      if (e.key === " ") {
        e.preventDefault();
        togglePause();
        return;
      }

      if (isPaused) return;

      if (/^[0-9]$/.test(e.key)) {
        answer(e.key);
        return;
      }

      if (e.key === "Backspace") {
        deleteOne();
        return;
      }

      if (e.key === "Enter") {
        submit();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isFinished, isPaused, input, question]);

  return {
    isPlaying,
    isFinished,
    timeLeft,
    remaining,
    question,
    input,
    isPaused,
    correctCount,
    missCount,


    togglePause,
    deleteOne,
    endGame,
    startGame,
    answer,
    submit,
    getBest,
    goHome,
  };
}