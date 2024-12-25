interface SecondaryButtonProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SecondaryButton = ({ text, onClick }: SecondaryButtonProps) => {
  return (
    <button
      type="button"
      className="cursor-pointer border-[1px] border-black px-5 py-2 text-black"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default SecondaryButton;
