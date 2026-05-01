// components/AnswerLogTable.tsx

type Props = {
  logs: {
    question: string;
    correctAnswer: number;
    userAnswer: string;
    isCorrect: boolean;
    level: number;
  }[];
};

export function AnswerLogTable({ logs }: Props) {
  return (
    <div className="log-table-wrap">
      <table className="log-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>レベル</th>
            <th>問題</th>
            <th>解答</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log, index) => (
            <tr key={index} className={log.isCorrect ? "" : "wrong-row"}>
              <td>{index + 1}</td>
              <td>Lv.{log.level}</td>
              <td>{log.question}</td>
              <td>
                {log.userAnswer}
                {!log.isCorrect && ` → ${log.correctAnswer}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}