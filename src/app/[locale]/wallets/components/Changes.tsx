interface ChangesProps {
  text: string;
  isPositive: boolean;
}

const Changes = ({ text, isPositive }: ChangesProps) => {
  if (!text) {
    return <span>-</span>;
  }

  return (
    <span
      className={`${isPositive ? "text-green-600" : "text-red-500"} font-bold`}
    >
      <span>{isPositive ? "▲" : "▼"}</span>
      <span>{text}</span>
    </span>
  );
};

export default Changes;
