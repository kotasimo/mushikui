export type Course = {
  id: string;
  label: string;
  seconds: number | null;
  mode: "practice" | "time";
  hardAfter?: number;
};

export const courses: Course[] = [
  {
    id: "practice",
    label: "練習",
    seconds: null,
    mode: "practice",
  },
  {
    id: "20s",
    label: "20秒",
    seconds: 20,
    mode: "time",
  },
  {
    id: "60s",
    label: "60秒",
    seconds: 60,
    mode: "time",
  },
  {
    id: "90s",
    label: "90秒",
    seconds: 90,
    mode: "time",
    hardAfter: 50,
  },
];