interface Props {
  children: React.ReactNode;
  params: Promise<{
    currency: string;
  }>;
}

export default async function CurrencyLayout(props: Props) {
  const params = await props.params;

  const { currency } = params;

  const { children } = props;

  return (
    <main className="flex h-full w-full flex-col">
      <h1 className="w-full text-center text-lg font-extrabold">{currency}</h1>
      {children}
    </main>
  );
}
