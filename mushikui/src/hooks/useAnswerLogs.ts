import { useState } from "react";

export type AnswerLog = {
  question: string;
  correctAnswer: number;
  userAnswer: string;
  isCorrect: boolean;
  level: number;
};

type AddLogParams = {
  question: string;
  correctAnswer: number;
  userAnswer: string;
  isCorrect: boolean;
  level: number;
};

export function useAnswerLogs() {
  const [answerLogs, setAnswerLogs] = useState<AnswerLog[]>([]);

  function addAnswerLog(log: AddLogParams) {
    setAnswerLogs((prev) => [...prev, log]);
  }

  function resetAnswerLogs() {
    setAnswerLogs([]);
  }

  return {
    answerLogs,
    addAnswerLog,
    resetAnswerLogs,
  };
}