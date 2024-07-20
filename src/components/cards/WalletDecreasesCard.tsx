import Changes from "@/app/[locale]/wallets/components/Changes";
import Card from "./Card";

interface Props {
  decreases: number;
}

export default function WalletDecreasesCard({ decreases }: Props) {
  return (
    <Card>
      <div className="flex flex-col items-center">
        <h4 className="font-extrabold">Decreases</h4>
        <p className="text-sm">
          <Changes text={decreases.toFixed(2)} isPositive={false} />
        </p>
      </div>
    </Card>
  );
}
