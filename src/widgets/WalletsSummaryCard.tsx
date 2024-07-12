interface Props {
  summaryList: { currency: string; moneyAmount: number }[];
}

const WalletsSummaryCard = ({ summaryList }: Props) => {
  console.log("asd");

  return (
    <ul className="p-5 text-sm rounded-md border-2 border-black">
      {summaryList.map((sl) => (
        <li key={sl.currency}>
          <strong>{sl.currency}</strong>: <span>{sl.moneyAmount}</span>
        </li>
      ))}
    </ul>
  );
};

export default WalletsSummaryCard;
