import { ClientWhistoryDto } from "@/types/wallets-history";
import { generateNumberArray } from "@/utils";

export const getWhistoryMinMaxTimestamps = (
  whistoryList: ClientWhistoryDto[]
) => {
  const firstItemTs = new Date(whistoryList[1].date).getTime();

  const { minDateTs, maxDateTs } = whistoryList.reduce(
    (acc, item) => {
      const ts = new Date(item.date).getTime();
      if (ts < acc.minDateTs) {
        return { ...acc, minDateTs: ts };
      }

      if (ts > acc.maxDateTs) {
        return { ...acc, maxDateTs: ts };
      }

      return acc;
    },
    {
      minDateTs: firstItemTs,
      maxDateTs: firstItemTs,
    }
  );

  return {
    minDateTs,
    maxDateTs,
  };
};

export const getAxisTimestamps = (whistoryList: ClientWhistoryDto[]) => {
  const { minDateTs, maxDateTs } = getWhistoryMinMaxTimestamps(whistoryList);
  return generateNumberArray(minDateTs, maxDateTs, (maxDateTs - minDateTs) / 6);
};
