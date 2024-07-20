import { replacePlaceholders } from "@/utils";
import Card from "./Card";
import { Dictionary } from "@/types/locale";

interface Props {
  d: Dictionary["whistoryPage"]["cards"]["whistoryEntriesSummary"];
  startDate: Date;
  endDate: Date;
  entriesCount: number;
}

export default function WhistoryEntriesSummaryCard({
  d,
  startDate,
  endDate,
  entriesCount,
}: Props) {
  return (
    <Card>
      <div className="h-full flex flex-col items-center justify-start">
        <h4 className="mb-1 font-extrabold">
          {replacePlaceholders(d.title, { entriesCount: `${entriesCount}` })}
        </h4>
        <p className="text-sm">{d.in}</p>
        <p className="flex gap-2 text-xs">
          <span>{startDate.toLocaleString().split(", ")[0]}</span>
          <span>-</span>
          <span>{endDate.toLocaleString().split(", ")[0]}</span>
        </p>
      </div>
    </Card>
  );
}
