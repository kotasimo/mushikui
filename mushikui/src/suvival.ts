import { useEffect, useState } from "react";
import { createQuestion, type Question } from "./createQuestion";

const SURVIVAL_BEST_KEY = "mushikui_survival_best";
const ANSWER_TIME_MS = 3000;
const MISS_LIMIT = 3;

export function useSurvivalGame() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeftMs, setTimeLeftMs] = useState(ANSWER_TIME_MS);
    const [question, setQuestion] = useState<Question | null>(null);
    const [input, setInput] = useState("");
    const [correctCount, setCorrectCount] = useState(0);
    const [missCount, setMissCount] = useState(0);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const [bestScore, setBestScore] = useState<number>(() => {
        const saved = localStorage.getItem(SURVIVAL_BEST_KEY);
        return saved ? Number(saved) : 0;
    });

    function startGame() {
        setIsPlaying(true);
        setIsFinished(false);
        setIsPaused(false);
        setTimeLeftMs(ANSWER_TIME_MS);
        setQuestion(createQuestion(0));
        setInput("");
        setCorrectCount(0);
        setMissCount(0);
        setQuestionNumber(0);
    }

    function deleteOne() {
        setInput((prev) => prev.slice(0, -1));
    }

    function togglePause() {
        if (!isPlaying || isFinished) return;
        setIsPaused((prev) => !prev);
    }

    function answer(value: string) {
        if (!isPlaying || isFinished) return;
        setInput((prev) => prev + value);
    }

    function submit() {
        if (!question || !isPlaying || isFinished || isPaused) return;

        const isCorrect = input !== "" && Number(input) === question.answer;

        const nextCorrectCount = isCorrect ? correctCount + 1 : correctCount;
        const nextMissCount = isCorrect ? missCount : missCount + 1;

        if (nextMissCount >= MISS_LIMIT) {
            setMissCount(nextMissCount);
            finishGame(nextCorrectCount);
            return;
        }

        setCorrectCount(nextCorrectCount);
        setMissCount(nextMissCount);
        setInput("");
        setQuestion(createQuestion(nextCorrectCount));
        setQuestionNumber((prev) => prev + 1);
    }

    function endGame() {
        finishGame(correctCount);
        setInput("");
    }

    function finishGame(finalScore: number) {
        setIsPlaying(false);
        setIsFinished(true);

        if (finalScore > bestScore) {
            setBestScore(finalScore);
            localStorage.setItem(SURVIVAL_BEST_KEY, String(finalScore));
        }
    }

    // キーボード入力
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (!isPlaying || isFinished) return;

            if (e.key === " ") {
                e.preventDefault();
                togglePause();
                return;
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPlaying, isFinished, isPaused, input, question, correctCount, missCount]);

    // 1問ごとの3秒タイマー
    useEffect(() => {
        if (!isPlaying || isFinished || !question || isPaused) return;

        setTimeLeftMs(ANSWER_TIME_MS);
        const startTime = Date.now();

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const next = Math.max(ANSWER_TIME_MS - elapsed, 0);

            setTimeLeftMs(next);

            if (next <= 0) {
                clearInterval(timer);
                submit();
            }
        }, 50);

        return () => clearInterval(timer);
    }, [questionNumber, isPlaying, isFinished, isPaused, question]);



    return {
        isPlaying,
        isFinished,
        timeLeftMs,
        question,
        input,
        correctCount,
        missCount,
        missLimit: MISS_LIMIT,
        bestScore,
        isPaused,
        togglePause,


        startGame,
        endGame,
        answer,
        deleteOne,
        submit,
    };
}