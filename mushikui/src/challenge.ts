

export type ChallengeCourse = {
    id: string;
    label: string;
    levels: number[];
    questionCount: number;
    timeLimit: number; // 秒
};

export const challengeCourses: ChallengeCourse[] = [
    {
        id: "c1",
        label: "Course 1",
        levels: [1, 2, 3],
        questionCount: 10,
        timeLimit: 60,
    },
    {
        id: "c2",
        label: "Course 2",
        levels: [4, 5],
        questionCount: 10,
        timeLimit: 60,
    },
    {
        id: "c3",
        label: "Course 3",
        levels: [6, 7, 8],
        questionCount: 10,
        timeLimit: 60,
    },
    {
        id: "c4",
        label: "Course 4",
        levels: [9, 10],
        questionCount: 10,
        timeLimit: 60,
    },
    {
        id: "c5",
        label: "Course 5",
        levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        questionCount: 20, // 多め
        timeLimit: 90,
    },
];
