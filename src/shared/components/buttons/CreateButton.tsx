"use client";

import Image from "next/image";

// icons
import PlusIcon from "@/assets/plus.svg";

interface CreateButtonProps {
  text?: string;
  onClick: () => void;
}

const CreateButton = ({ text, onClick }: CreateButtonProps) => (
  <button
    className="inline-flex cursor-pointer items-center space-x-2 opacity-75 hover:underline hover:opacity-100"
    onClick={onClick}
  >
    <Image src={PlusIcon} width={16} height={16} alt="plus" />

    {text ? <span>{text}</span> : null}
  </button>
);

export default CreateButton;
