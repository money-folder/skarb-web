interface Props {
  children: React.ReactNode;
}

export default function Card({ children }: Props) {
  return (
    <div className="h-[90px] w-[180px] flex justify-center items-center border-b-2 border-black">
      {children}
    </div>
  );
}
