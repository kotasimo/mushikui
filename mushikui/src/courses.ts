export type Course = {
  id: "practice" | "20s" | "60s" | "90s";
  label: string;
  seconds: number | null;
};

export const courses: Course[] = [
  { id: "20s", label: "20秒", seconds: 20 },
  { id: "60s", label: "60秒", seconds: 60 },
  { id: "90s", label: "90秒", seconds: 90 },
  { id: "practice", label: "練習", seconds: null },
];