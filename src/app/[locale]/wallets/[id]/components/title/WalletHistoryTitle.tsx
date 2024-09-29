import { fetchWallet } from '@/actions/wallets';
import { replacePlaceholders } from '@/utils';

interface Props {
  pageTitleTemplate: string;
  walletId: string;
}

export default async function WalletHistoryTitle({ pageTitleTemplate, walletId }: Props) {
  const wallet = await fetchWallet(walletId);

  return (
    <h1 className="col-span-3 row-span-1 w-full text-center text-lg font-extrabold">
      {replacePlaceholders(pageTitleTemplate, {
        walletName: wallet?.data?.name ? `${wallet.data.name}` : `Wallet`,
      })}
    </h1>
  );
}
