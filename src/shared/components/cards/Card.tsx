interface Props {
  children: React.ReactNode;
}

export default function Card({ children }: Props) {
  return (
    <div className="flex h-[90px] w-[180px] items-center justify-center border-b-2 border-black">
      {children}
    </div>
  );
}
