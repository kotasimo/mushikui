type AnswerLog = {
    question: string;
    correctAnswer: number;
    userAnswer: string;
    isCorrect: boolean;
    level: number;
};

type Props = {
    logs: AnswerLog[];
    onBack: () => void;
};

export function AnswerLogScreen({ logs, onBack }: Props) {
    
    return (
        <main className="screen log-screen">
            <h1 className="log-title">履歴</h1>

            <div className="log-table-wrap">
                <table className="log-table">
                    <thead>
                        <tr>
                            <th>Nu.</th>
                            <th>レベル</th>
                            <th>問題</th>
                            <th>解答</th>
                        </tr>
                    </thead>

                    <tbody>
                        {logs.map((log, index) => (
                            <tr
                                key={index}
                                className={log.isCorrect ? "" : "wrong-row"}
                            >
                                <td>{index + 1}</td>
                                <td>Lv.{log.level}</td>
                                <td>{log.question}</td>
                                <td>{log.correctAnswer}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className="back-button" onClick={onBack}>
                Back
            </button>
        </main>
    );
}