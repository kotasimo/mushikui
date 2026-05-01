type MenuButtonProps = {
  label: string;
  info?: React.ReactNode;
  onClick: () => void;
};

export function MenuButton({ label, info, onClick }: MenuButtonProps) {
  return (
    <div className="menu-item">
      <button onClick={onClick}>{label}</button>
      {info && <div className="best">{info}</div>}
    </div>
  );
}