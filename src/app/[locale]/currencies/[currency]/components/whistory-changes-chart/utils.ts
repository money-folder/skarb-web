import { ClientWhistoryDto } from "@/app/[locale]/wallets/[id]/types";

export const getWhistoryAbsChangesData = (
  whistoryList: ClientWhistoryDto[],
) => {
  const result = [];

  for (let i = whistoryList.length - 1; i > 0; i -= 1) {
    const startDate = whistoryList[i - 1].date;
    const finishDate = whistoryList[i].date;
    const dateDiff = finishDate.getTime() - startDate.getTime();
    const midDate = new Date(Math.floor(startDate.getTime() + dateDiff / 2));
    const changes = +(
      whistoryList[i].moneyAmount - whistoryList[i - 1].moneyAmount
    ).toFixed(2);

    result.unshift({
      startDate,
      midDate,
      finishDate,
      changes,
    });
  }

  return result;
};
