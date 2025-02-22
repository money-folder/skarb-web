import { getDictionary } from "@/dictionaries";
import { getServerLocale } from "@/getServerLocale";
import {
  calculateDateDifference,
  formatDateDifference,
} from "@/shared/utils/time-utils";
import { replacePlaceholders } from "@/shared/utils/utils";
import Card from "./Card";

interface Props {
  startDate: Date;
  endDate: Date;
  entriesCount: number;
}

// @TODO: Rename -- this component is used for both whistory and currencies
export default async function WhistoryEntriesSummaryCard({
  startDate,
  endDate,
  entriesCount,
}: Props) {
  const locale = getServerLocale();
  const d = await getDictionary(
    locale,
    "whistoryPage.cards.whistoryEntriesSummary",
  );

  const dateDiff = calculateDateDifference(startDate, endDate);
  return (
    <Card>
      <div className="flex h-full flex-col items-center justify-start">
        <h4 className="mb-1 font-extrabold">
          {replacePlaceholders(d.title, { entriesCount: `${entriesCount}` })}
        </h4>
        <p className="text-sm">{d.in}</p>
        <p className="flex gap-2 text-xs">
          {formatDateDifference(
            {
              years: dateDiff.years,
              months: dateDiff.months,
              days: dateDiff.days,
            },
            locale,
          )}
        </p>
      </div>
    </Card>
  );
}
