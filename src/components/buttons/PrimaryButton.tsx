interface PrimarySubmitProps {
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const PrimaryButton = ({ type, text }: PrimarySubmitProps) => {
  return (
    <button
      type={type}
      className="px-5 py-2 text-white bg-black cursor-pointer"
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
