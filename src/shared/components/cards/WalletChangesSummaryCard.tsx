import Changes from "@/app/[locale]/wallets/components/Changes";
import { Card } from "@/components/ui/card";

interface Props {
  text: string;
  increases: number;
  decreases: number;
  diff: number;
}

// @TODO: Rename -- this component is used for both whistory and currencies
export default function WalletChangesSummaryCard({
  text,
  increases,
  decreases,
  diff,
}: Props) {
  return (
    <Card className="flex h-[100px] w-[180px] items-center justify-center py-2">
      <div className="flex h-full flex-col items-end justify-start">
        <h4 className="mb-1 font-extrabold">{text}</h4>
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
