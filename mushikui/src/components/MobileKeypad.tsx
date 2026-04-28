type MobileKeypadProps = {
  onNumber: (value: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
};

export function MobileKeypad({
  onNumber,
  onDelete,
  onSubmit,
}: MobileKeypadProps) {
  return (
    <div className="mobile-keypad">
      <button onClick={() => onNumber("1")}>1</button>
      <button onClick={() => onNumber("2")}>2</button>
      <button onClick={() => onNumber("3")}>3</button>
      <button className="key-function" onClick={onDelete}>
        消
      </button>

      <button onClick={() => onNumber("4")}>4</button>
      <button onClick={() => onNumber("5")}>5</button>
      <button onClick={() => onNumber("6")}>6</button>
      <div />

      <button onClick={() => onNumber("7")}>7</button>
      <button onClick={() => onNumber("8")}>8</button>
      <button onClick={() => onNumber("9")}>9</button>
      <button className="key-function key-ok" onClick={onSubmit}>
        OK
      </button>

      <div />
      <button className="key-zero" onClick={() => onNumber("0")}>
        0
      </button>
      <div />
      <div />
    </div>
  );
}