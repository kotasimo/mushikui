

export type Question = {
  text: string;
  answer: number;
};

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createQuestion(correctCount: number): Question {
  const level =
    correctCount >= 30 ? 4 :
      correctCount >= 20 ? 3 :
        correctCount >= 10 ? 2 :
          1;

  const ops =
    level === 1
      ? ["+", "-"]
      : level === 2
        ? ["+", "-", "×"]
        : ["+", "-", "×", "÷"];

  const op = ops[Math.floor(Math.random() * ops.length)];

  // --- 足し算 ---
  if (op === "+") {
    const isLevel4 = level >= 4;

    const a = isLevel4 ? rand(1, 99) : rand(1, level === 1 ? 9 : 20);
    const b = isLevel4 ? rand(1, 9) : rand(1, level === 1 ? 9 : 20);

    const result = a + b;

    if (Math.random() < 0.5) {
      return { text: `□ + ${b} = ${result}`, answer: a };
    } else {
      return { text: `${a} + □ = ${result}`, answer: b };
    }
  }

  // --- 引き算 ---
  if (op === "-") {
    const isLevel4 = level >= 4;

    const a = isLevel4 ? rand(10, 99) : rand(1, level === 1 ? 9 : 20);
    const b = isLevel4 ? rand(1, 9) : rand(1, a);

    if (Math.random() < 0.5) {
      return { text: `□ - ${b} = ${a - b}`, answer: a };
    } else {
      return { text: `${a} - □ = ${a - b}`, answer: b };
    }
  }

  // --- 掛け算 ---
  if (op === "×") {
    const a = rand(1, 9);
    const b = rand(2, 9);
    const result = a * b;

    if (Math.random() < 0.5) {
      return { text: `□ × ${b} = ${result}`, answer: a };
    } else {
      return { text: `${a} × □ = ${result}`, answer: b };
    }
  }

  // --- 割り算 ---
  const a = rand(2, 9);
  const b = rand(2, 9);

  if (Math.random() < 0.5) {
    return {
      text: `□ ÷ ${b} = ${a}`,
      answer: a * b,
    };
  } else {
    return {
      text: `${a * b} ÷ □ = ${b}`,
      answer: a,
    };
  }
}