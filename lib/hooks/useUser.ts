import { UserContext, useUser as auth0UseUser } from '@auth0/nextjs-auth0';

export function useUser() {
  let useResult: UserContext = {
    user: {
      email: 'test@example.com',
      email_verified: true,
      name: 'test',
      nickname: 'test',
      picture: 'https://example.com',
    },
    isLoading: false,
    checkSession: () => Promise.resolve(),
  };
  if (!process.env.NEXT_PUBLIC_AUTH0_DISABLED) {
    useResult = auth0UseUser() as any;
  }
  return useResult;
}
