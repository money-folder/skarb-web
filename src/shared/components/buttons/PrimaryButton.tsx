interface PrimarySubmitProps {
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const PrimaryButton = ({ type, text, onClick }: PrimarySubmitProps) => {
  return (
    <button
      type={type}
      className="cursor-pointer bg-black px-5 py-2 text-white"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
