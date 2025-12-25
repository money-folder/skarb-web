import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";

interface Props {
  locale: Locale;
  currency: string;
  fromTs?: number;
  toTs?: number;
}

export default async function HistoryEmptyState({
  locale,
  currency,
  fromTs,
  toTs,
}: Props) {
  const d = await getDictionary(
    locale,
    "currencyPage.historyFilters.emptyState",
  );

  const formatDate = (timestamp?: number) => {
    if (!timestamp) {
      return d.notSet;
    }

    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-[400px] items-start justify-center">
      <div className="w-full max-w-md space-y-6 px-2 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{d.title}</h2>
          <p className="text-muted-foreground">{d.description}</p>
        </div>

        <div className="space-y-3 border-t pt-6 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground">
              {d.currency}
            </span>
            <span className="font-mono">{currency}</span>
          </div>

          {fromTs && (
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground">
                {d.from}
              </span>
              <span>{formatDate(fromTs)}</span>
            </div>
          )}

          {toTs && (
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground">{d.to}</span>
              <span>{formatDate(toTs)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
