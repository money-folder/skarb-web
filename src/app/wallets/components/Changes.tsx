interface ChangesProps {
  percents: number;
}

const Changes = ({ percents }: ChangesProps) => {
  if (!percents) {
    return <span>-</span>;
  }

  return (
    <span
      className={`${
        percents >= 0 ? "text-green-600" : "text-red-500"
      } font-bold`}
    >
      <span>{percents >= 0 ? "▲" : "▼"}</span>
      <span>{percents}%</span>
    </span>
  );
};

export default Changes;
