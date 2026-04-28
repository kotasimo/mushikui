export type Question = {
  text: string;
  answer: number;
};

type QuestionType =
  | "oneDigitAdd"
  | "oneDigitSub"
  | "oneDigitMul"
  | "oneDigitDiv"
  | "twoDigitAddOneDigit"
  | "twoDigitSubOneDigit"
  | "twoDigitMulOneDigit"
  | "twoDigitDivOneDigit"
  | "twoDigitAddTwoDigitNoCarry"
  | "twoDigitSubTwoDigitNoBorrow";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function createQuestion(correctCount: number): Question {
  const level =
    correctCount >= 40 ? 5 :
      correctCount >= 30 ? 4 :
        correctCount >= 20 ? 3 :
          correctCount >= 10 ? 2 :
            1;

  let types: QuestionType[];

  if (level === 1) {
    // Lv1は足し算・引き算だけ
    types = ["oneDigitAdd", "oneDigitSub"];
  } else {
    // Lv2以降は「加減算」か「乗除算」を50%で選ぶ
    const isAddSub = Math.random() < 0.5;

    if (isAddSub) {
      types = ["oneDigitAdd", "oneDigitSub"];

      if (level >= 3) {
        types.push("twoDigitAddOneDigit", "twoDigitSubOneDigit");
      }

      if (level >= 5) {
        types.push(
          "twoDigitAddTwoDigitNoCarry",
          "twoDigitSubTwoDigitNoBorrow"
        );
      }
    } else {
      types = ["oneDigitMul", "oneDigitDiv"];

      if (level >= 4) {
        types.push("twoDigitMulOneDigit", "twoDigitDivOneDigit");
      }
    }
  }

  const type = pick(types);

  console.log({ level, types, type });

  switch (type) {
    case "oneDigitAdd":
      return createAdd(rand(1, 9), rand(1, 9));

    case "oneDigitSub":
      return createSub(rand(1, 9), rand(1, 9));

    case "oneDigitMul":
      return createMul(rand(1, 9), rand(1, 9));

    case "oneDigitDiv":
      return createDiv(rand(1, 9), rand(1, 9));

    case "twoDigitAddOneDigit":
      return createAdd(rand(10, 99), rand(1, 9));

    case "twoDigitSubOneDigit":
      return createSub(rand(10, 99), rand(1, 9));

    case "twoDigitMulOneDigit": {
      const b = rand(2, 9);
      const a = rand(10, Math.floor(99 / b));
      return createMul(a, b);
    }

    case "twoDigitDivOneDigit": {
      const b = rand(2, 9);
      const answer = rand(10, Math.floor(99 / b));
      return createDiv(answer, b);
    }

    case "twoDigitAddTwoDigitNoCarry": {
      const { a, b } = makeNoCarryAdd();
      return createAdd(a, b);
    }

    case "twoDigitSubTwoDigitNoBorrow": {
      const { a, b } = makeNoBorrowSub();
      return createSub(a, b);
    }
  }
}

function createAdd(a: number, b: number): Question {
  const result = a + b;

  if (Math.random() < 0.5) {
    return { text: `□ + ${b} = ${result}`, answer: a };
  }

  return { text: `${a} + □ = ${result}`, answer: b };
}

function createSub(a: number, b: number): Question {
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);
  const result = bigger - smaller;

  if (Math.random() < 0.5) {
    return { text: `□ - ${smaller} = ${result}`, answer: bigger };
  }

  return { text: `${bigger} - □ = ${result}`, answer: smaller };
}

function createMul(a: number, b: number): Question {
  const result = a * b;

  if (Math.random() < 0.5) {
    return { text: `□ × ${b} = ${result}`, answer: a };
  }

  return { text: `${a} × □ = ${result}`, answer: b };
}

function createDiv(a: number, b: number): Question {
  const result = a * b;

  if (Math.random() < 0.5) {
    return { text: `□ ÷ ${b} = ${a}`, answer: result };
  }

  return { text: `${result} ÷ □ = ${b}`, answer: a };
}

function makeNoCarryAdd() {
  const a10 = rand(1, 9);
  const a1 = rand(0, 9);

  const b10 = rand(1, 9 - a10);
  const b1 = rand(0, 9 - a1);

  return {
    a: a10 * 10 + a1,
    b: b10 * 10 + b1,
  };
}

function makeNoBorrowSub() {
  const a10 = rand(1, 9);
  const a1 = rand(0, 9);

  const b10 = rand(1, a10);
  const b1 = rand(0, a1);

  return {
    a: a10 * 10 + a1,
    b: b10 * 10 + b1,
  };
}