'use client';

import React, { useContext } from 'react';
import * as a from '@mui/material';

import CreateItemButton from '@/components/buttons/CreateButton';
import { OverlayContext } from '@/components/overlay/OverlayProvider';

import AddWhistoryModal from './CreateWhistoryModal';

interface CreateWhistoryButtonProps {
  walletId: string;
  walletName: string;
  text?: string;
}

const CreateWhistoryButton = ({ walletId, walletName, text = '' }: CreateWhistoryButtonProps) => {
  const { addOverlay } = useContext(OverlayContext);

  console.log(a);

  const onClick = () => {
    addOverlay(({ removeSelf }) => (
      <AddWhistoryModal walletId={walletId} walletName={walletName} close={removeSelf} />
    ));
  };

  return <CreateItemButton text={text} onClick={onClick} />;
};

export default CreateWhistoryButton;
