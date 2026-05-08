export type ChallengeCourse = {
    id: string;
    label: string;
    levels: number[];
    questionCount: number;
    timeLimit: number;
};

export const challengeCourses: ChallengeCourse[] = [
    {
        id: "c1",
        label: "Lv1",
        levels: [1],
        questionCount: 30,
        timeLimit: 60,
    },
    {
        id: "c2",
        label: "Lv2",
        levels: [1, 2],
        questionCount: 30,
        timeLimit: 60,
    },
    {
        id: "c3",
        label: "Lv3",
        levels: [1, 2, 3],
        questionCount: 30,
        timeLimit: 60,
    },
    {
        id: "c4",
        label: "Lv4",
        levels: [1, 2, 3, 4],
        questionCount: 30,
        timeLimit: 80,
    },
    {
        id: "c5",
        label: "Lv5",
        levels: [1, 2, 3, 4, 5],
        questionCount: 30,
        timeLimit: 90,
    },
    {
        id: "c6",
        label: "Lv6",
        levels: [1, 2, 3, 4, 5, 6],
        questionCount: 30,
        timeLimit: 100,
    },
    {
        id: "c7",
        label: "Lv7",
        levels: [1, 2, 3, 4, 5, 6, 7],
        questionCount: 30,
        timeLimit: 100,
    },
    {
        id: "c8",
        label: "Lv8",
        levels: [1, 2, 3, 4, 5, 6, 7, 8],
        questionCount: 30,
        timeLimit: 110,
    },
    {
        id: "c9",
        label: "Lv9",
        levels: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        questionCount: 30,
        timeLimit: 130,
    },
    {
        id: "c10",
        label: "Lv10",
        levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        questionCount: 30,
        timeLimit: 130,
    },
    {
        id: "c11",
        label: "Lv11",
        levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        questionCount: 30,
        timeLimit: 150,
    },
];