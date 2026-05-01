type BaseQuestion = {
  text: string;
  answer: number;
};

export type Question = BaseQuestion & {
  level: number;
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
  | "twoDigitSubTwoDigitNoBorrow"
  | "twoDigitAddTwoDigitCarry"
  | "twoDigitSubTwoDigitBorrow"
  | "twoDigitMulOneDigitFull"
  | "threeDigitDivOneDigit"
  | "twoDigitAddTwoDigitAny"
  | "threeDigitSubTwoDigit"
  | "teenMulTenToThirty"
  | "teenDivTenToThirty"
  | "twoDigitMulTwoDigitUnder1000"
  | "threeDigitDivTwoDigit"
  | "twoDigitMulTwoDigitFull"
  | "fourDigitDivTwoDigit"
  ;

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const allLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export function createQuestion(correctCount: number): Question {
  const level =
    correctCount >= 100 ? 11 :
      correctCount >= 90 ? 10 :
        correctCount >= 80 ? 9 :
          correctCount >= 70 ? 8 :
            correctCount >= 60 ? 7 :
              correctCount >= 50 ? 6 :
                correctCount >= 40 ? 5 :
                  correctCount >= 30 ? 4 :
                    correctCount >= 20 ? 3 :
                      correctCount >= 10 ? 2 :
                        1;

  const questionTypesByLevel: Record<number, QuestionType[]> = {
    1: ["oneDigitAdd", "oneDigitSub"],
    2: ["oneDigitMul", "oneDigitDiv"],
    3: ["twoDigitAddOneDigit", "twoDigitSubOneDigit"],
    4: ["twoDigitMulOneDigit", "twoDigitDivOneDigit"],
    5: ["twoDigitAddTwoDigitNoCarry", "twoDigitSubTwoDigitNoBorrow"],
    6: ["twoDigitAddTwoDigitCarry", "twoDigitSubTwoDigitBorrow"],
    7: ["twoDigitMulOneDigitFull", "threeDigitDivOneDigit"],
    8: ["twoDigitAddTwoDigitAny", "threeDigitSubTwoDigit"],
    9: ["teenMulTenToThirty", "teenDivTenToThirty"],
    10: ["twoDigitMulTwoDigitUnder1000", "threeDigitDivTwoDigit"],
    11: ["twoDigitMulTwoDigitFull", "fourDigitDivTwoDigit"],
  };

  function pickQuestionLevel(currentLevel: number): number {
    if (currentLevel === 1) {
      return 1;
    }

    if (currentLevel === 2) {
      return Math.random() < 0.7 ? 2 : 1;
    }

    if (currentLevel === 3) {
      const r = Math.random();

      if (r < 0.5) return 3;

      const lowerLevels = [1, 2];
      return pick(lowerLevels);
    }

    const r = Math.random();

    if (r < 0.3) {
      return currentLevel;
    }

    const candidates = allLevels.filter(
      (level) => level < currentLevel || level === currentLevel + 1
    );

    return pick(candidates);
  }

  // console.log({ level, questionLevel, type });

  const questionLevel = pickQuestionLevel(level);
  const type = pick(questionTypesByLevel[questionLevel]);
  const question = createQuestionByType(type);

  return {
    ...question,
    level: questionLevel,
  };
}

export function createQuestionByLevel(level: number): Question {
  let types: QuestionType[];

  if (level === 1) {
    types = ["oneDigitAdd", "oneDigitSub"];
  } else {
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

      if (level >= 6) {
        types.push(
          "twoDigitAddTwoDigitCarry",
          "twoDigitSubTwoDigitBorrow"
        );
      }

      if (level >= 8) {
        types.push("twoDigitAddTwoDigitAny", "threeDigitSubTwoDigit");
      }
    } else {
      types = ["oneDigitMul", "oneDigitDiv"];

      if (level >= 4) {
        types.push("twoDigitMulOneDigit", "twoDigitDivOneDigit");
      }

      if (level >= 7) {
        types.push("twoDigitMulOneDigitFull", "threeDigitDivOneDigit");
      }

      if (level >= 9) {
        types.push("teenMulTenToThirty", "teenDivTenToThirty");
      }

      if (level >= 10) {
        types.push("twoDigitMulTwoDigitUnder1000", "threeDigitDivTwoDigit");
      }

      if (level >= 11) {
        types.push("twoDigitMulTwoDigitFull", "fourDigitDivTwoDigit");
      }
    }
  }

  const type = pick(types);
  const question = createQuestionByType(type);

  return {
    ...question,
    level,
  };
}

function createQuestionByType(type: QuestionType): BaseQuestion {
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

    case "twoDigitAddTwoDigitCarry": {
      const { a, b } = makeCarryAddUnder100();
      return createAdd(a, b);
    }

    case "twoDigitSubTwoDigitBorrow": {
      const { a, b } = makeBorrowSub();
      return createSub(a, b);
    }

    case "twoDigitMulOneDigitFull": {
      const a = rand(10, 99);
      const b = rand(2, 9);
      return createMul(a, b);
    }

    case "threeDigitDivOneDigit": {
      const b = rand(2, 9);
      const answer = rand(10, 99); // 商は2桁
      return createDiv(answer, b);
    }

    case "twoDigitAddTwoDigitAny": {
      const a = rand(10, 99);
      const b = rand(10, 99);
      return createAdd(a, b);
    }

    case "threeDigitSubTwoDigit": {
      const b = rand(10, 99);
      const a = rand(100, 199); // ここで3桁確定
      return createSub(a, b);
    }

    case "teenMulTenToThirty": {
      const a = rand(10, 19);
      const b = rand(10, 30);
      return createMul(a, b);
    }

    case "teenDivTenToThirty": {
      const a = rand(10, 19);
      const b = rand(10, 30);
      return createDiv(a, b);
    }

    case "twoDigitMulTwoDigitUnder1000": {
      const { a, b } = makeTwoDigitMulUnder1000();
      return createMul(a, b);
    }

    case "threeDigitDivTwoDigit": {
      const { a, b } = makeTwoDigitMulUnder1000();
      return createDiv(a, b);
    }

    case "twoDigitMulTwoDigitFull": {
      const a = rand(10, 99);
      const b = rand(10, 99);
      return createMul(a, b);
    }

    case "fourDigitDivTwoDigit": {
      const a = rand(10, 99);
      const b = rand(10, 99);
      return createDiv(a, b);
    }
  }
}
function createAdd(a: number, b: number): BaseQuestion {
  const result = a + b;

  if (Math.random() < 0.5) {
    return { text: `□ + ${b} = ${result}`, answer: a };
  }

  return { text: `${a} + □ = ${result}`, answer: b };
}

function createSub(a: number, b: number): BaseQuestion {
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);
  const result = bigger - smaller;

  if (Math.random() < 0.5) {
    return { text: `□ - ${smaller} = ${result}`, answer: bigger };
  }

  return { text: `${bigger} - □ = ${result}`, answer: smaller };
}

function createMul(a: number, b: number): BaseQuestion {
  const result = a * b;

  if (Math.random() < 0.5) {
    return { text: `□ × ${b} = ${result}`, answer: a };
  }

  return { text: `${a} × □ = ${result}`, answer: b };
}

function createDiv(a: number, b: number): BaseQuestion {
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


function makeCarryAddUnder100() {
  while (true) {
    const a = rand(10, 99);
    const b = rand(10, 99);

    const hasCarry = (a % 10) + (b % 10) >= 10;

    if (hasCarry && a + b < 100) {
      return { a, b };
    }
  }
}

function makeBorrowSub() {
  while (true) {
    const a = rand(10, 99);
    const b = rand(10, 99);

    const bigger = Math.max(a, b);
    const smaller = Math.min(a, b);

    const hasBorrow = (bigger % 10) < (smaller % 10);

    if (hasBorrow) {
      return { a: bigger, b: smaller };
    }
  }
}

function makeTwoDigitMulUnder1000() {
  while (true) {
    const a = rand(10, 99);
    const b = rand(10, 99);

    if (a * b < 1000) {
      return { a, b };
    }
  }
}