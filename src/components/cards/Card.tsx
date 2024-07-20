interface Props {
  children: React.ReactNode;
}

export default function Card({ children }: Props) {
  return (
    <div className="px-7 h-[90px] flex justify-center items-center border-b-2 border-black">
      {children}
    </div>
  );
}
