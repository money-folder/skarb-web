import Changes from "@/app/[locale]/wallets/components/Changes";
import Card from "./Card";

interface Props {
  text: string;
  increases: number;
  decreases: number;
  diff: number;
}

export default function WalletChangesCard({
  text,
  increases,
  decreases,
  diff,
}: Props) {
  return (
    <Card>
      <div className="flex flex-col items-end">
        <h4 className="font-extrabold">{text}</h4>
        <p className="text-xs">
          <Changes text={increases.toFixed(2)} isPositive />
        </p>
        <p className="text-xs">
          <Changes text={decreases.toFixed(2)} isPositive={false} />
        </p>
        <p className="mt-1 text-xs">
          <Changes text={diff.toFixed(2)} isPositive={diff > 0} />
        </p>
      </div>
    </Card>
  );
}
