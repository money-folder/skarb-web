import { Locale } from "@/locale";
import EarningsContainer from "./components/EarningsContainer";

interface Props {
  params: Promise<{
    locale: Locale;
    currency: string;
  }>;
  searchParams: Promise<{
    fromTs?: string;
    toTs?: string;
    types?: string;
    comment?: string;
    page?: string;
    pageSize?: string;
  }>;
}

export default async function EarningsPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const fromTs = searchParams.fromTs ? Number(searchParams.fromTs) : undefined;
  const toTs = searchParams.toTs ? Number(searchParams.toTs) : undefined;
  const types = searchParams.types?.split(",").filter(Boolean);
  const comment = searchParams.comment;
  const page = searchParams.page ? Number(searchParams.page) : undefined;
  const pageSize = searchParams.pageSize
    ? Number(searchParams.pageSize)
    : undefined;

  return (
    <div className="grid h-full w-full grid-cols-1 grid-rows-[1fr] gap-5 overflow-hidden p-5">
      <div className="col-span-1 row-span-1 overflow-hidden">
        <EarningsContainer
          locale={params.locale}
          currency={params.currency}
          fromTs={fromTs}
          toTs={toTs}
          types={types}
          comment={comment}
          page={page}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
