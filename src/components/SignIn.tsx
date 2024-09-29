import { signIn } from '@/auth';

interface Props {
  text: string;
}

export function SignIn({ text }: Props) {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('github');
      }}
    >
      <button type="submit" className="hover:underline">
        {text}
      </button>
    </form>
  );
}
