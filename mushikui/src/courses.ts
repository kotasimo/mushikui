export type Course = {
  id: "practice" | "20s" | "60s" | "90s";
  label: string;
  seconds: number | null;
};

export const courses: Course[] = [
  { id: "20s", label: "20s", seconds: 20 },
  { id: "60s", label: "60s", seconds: 60 },
  { id: "90s", label: "90s", seconds: 90 },
  { id: "practice", label: "practice", seconds: null },
];