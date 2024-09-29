'use client';

import { useContext } from 'react';

import CreateButton from '@/components/buttons/CreateButton';
import { OverlayContext } from '@/components/overlay/OverlayProvider';

import CreateWalletModal from './CreateWalletModal';

interface CreateWalletButtonProps {
  text?: string;
}

export default function CreateWalletButton({ text = '' }: CreateWalletButtonProps) {
  const { addOverlay } = useContext(OverlayContext);

  const onClick = () => {
    addOverlay(({ removeSelf }) => <CreateWalletModal close={removeSelf} />);
  };

  return <CreateButton text={text} onClick={onClick} />;
}
