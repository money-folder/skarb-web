'use client';

import Image from 'next/image';

import DuplicateIcon from '@/assets/duplicate.svg';
import { duplicate } from '@/actions/wallet-history';

interface Props {
  walletId: string;
  whistoryId: string;
}

const DuplicateButton = ({ whistoryId, walletId }: Props) => {
  return (
    <button
      className="h-4 w-4 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => duplicate(whistoryId, walletId)}
    >
      <Image src={DuplicateIcon} width={16} height={16} alt="duplicate" />
    </button>
  );
};

export default DuplicateButton;
