import Changes from "@/app/[locale]/wallets/components/Changes";
import Card from "./Card";

interface Props {
  text: string;
  decreases: number;
}

export default function WalletDecreasesCard({ text, decreases }: Props) {
  return (
    <Card>
      <div className="flex flex-col items-center">
        <h4 className="font-extrabold">{text}</h4>
        <p className="text-sm">
          <Changes text={decreases.toFixed(2)} isPositive={false} />
        </p>
      </div>
    </Card>
  );
}
