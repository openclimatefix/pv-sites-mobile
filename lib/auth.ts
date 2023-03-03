import { withPageAuthRequired as auth0WithPageAuthRequired } from '@auth0/nextjs-auth0';

export function withPageAuthRequired(
  ...auth0Params: Parameters<typeof auth0WithPageAuthRequired>
) {
  return process.env.AUTH0_DISABLED
    ? undefined
    : auth0WithPageAuthRequired(...auth0Params);
}
