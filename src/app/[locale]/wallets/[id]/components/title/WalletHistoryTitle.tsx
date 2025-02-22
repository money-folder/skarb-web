import { fetchWallet } from "@/app/[locale]/wallets/actions";
import { getDictionary } from "@/dictionaries";
import { getServerLocale } from "@/getServerLocale";
import { replacePlaceholders } from "@/shared/utils/utils";

interface Props {
  walletId: string;
}

export default async function WalletHistoryTitle({ walletId }: Props) {
  const locale = getServerLocale();
  const pageTitleTemplate = await getDictionary(locale, "whistoryPage.title");

  const wallet = await fetchWallet(walletId);

  return (
    <h1 className="col-span-3 row-span-1 w-full text-center text-lg font-extrabold">
      {replacePlaceholders(pageTitleTemplate, {
        walletName: wallet?.data?.name ? `${wallet.data.name}` : `Wallet`,
      })}
    </h1>
  );
}
