import { useEffect, useState } from "react";
import { createQuestion, type Question } from "./createQuestion";
import { useAnswerLogs } from "./hooks/useAnswerLogs";

const getSurvivalBestKey = (timeMs: number) =>
    `mushikui_survival_best_${timeMs}`;
const DEFAULT_ANSWER_TIME_MS = 3000;
const MISS_LIMIT = 3;

export function useSurvivalGame() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeftMs, setTimeLeftMs] = useState(DEFAULT_ANSWER_TIME_MS);
    const [question, setQuestion] = useState<Question | null>(null);
    const [input, setInput] = useState("");
    const [correctCount, setCorrectCount] = useState(0);
    const [missCount, setMissCount] = useState(0);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isNewBest, setIsNewBest] = useState(false);
    const [answerTimeMs, setAnswerTimeMs] = useState(DEFAULT_ANSWER_TIME_MS);

    const [bestScore, setBestScore] = useState<number>(() => {
        const saved = localStorage.getItem(getSurvivalBestKey(3000));
        return saved ? Number(saved) : 0;
    });

    const { answerLogs, addAnswerLog, resetAnswerLogs } = useAnswerLogs();

    function startGame() {
        setIsPlaying(false);
        setIsFinished(false);
        setIsPaused(false);
        setTimeLeftMs(answerTimeMs);
        setQuestion(createQuestion(0));
        setInput("");
        setCorrectCount(0);
        setMissCount(0);
        setQuestionNumber(0);
        setIsNewBest(false);
        setCountdown(3);
        resetAnswerLogs();
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

        if (question) {
            addAnswerLog({
                question: question.text,
                correctAnswer: question.answer,
                userAnswer: input,
                isCorrect,
                level: question.level,
            });
        }

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

    useEffect(() => {
        const saved = localStorage.getItem(getSurvivalBestKey(answerTimeMs));
        setBestScore(saved ? Number(saved) : 0);
    }, [answerTimeMs]);

    function finishGame(finalScore: number) {
        setIsPlaying(false);
        setIsFinished(true);

        if (finalScore > bestScore) {
            setIsNewBest(true);
            setBestScore(finalScore);
            localStorage.setItem(
                getSurvivalBestKey(answerTimeMs),
                String(finalScore)
            );
        } else {
            setIsNewBest(false);
        }
    }

    function getBestScore(timeMs: number) {
        const saved = localStorage.getItem(getSurvivalBestKey(timeMs));
        return saved ? Number(saved) : 0;
    }

    function goHome() {
        setIsPlaying(false);
        setIsFinished(false);
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
    }, [isPlaying, isFinished, isPaused, input, question, correctCount, missCount]);

    // 1問ごとの3秒タイマー
    useEffect(() => {
        if (!isPlaying || isFinished || !question || isPaused) return;

        setTimeLeftMs(answerTimeMs);
        const startTime = Date.now();

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const next = Math.max(answerTimeMs - elapsed, 0);

            setTimeLeftMs(next);

            if (next <= 0) {
                clearInterval(timer);
                submit();
            }
        }, 50);

        return () => clearInterval(timer);
    }, [questionNumber, isPlaying, isFinished, isPaused, question]);

    useEffect(() => {
        if (countdown === null) return;

        if (countdown === 0) {
            setCountdown(null);
            setIsPlaying(true);
            setTimeLeftMs(answerTimeMs);
            setQuestion(createQuestion(0));
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((prev) => (prev === null ? null : prev - 1));
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);


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
        questionNumber,
        answerTimeMs,
        countdown,
        isNewBest,
        answerLogs,
        setAnswerTimeMs,
        getBestScore,


        startGame,
        endGame,
        answer,
        deleteOne,
        submit,
        goHome,
    };
}