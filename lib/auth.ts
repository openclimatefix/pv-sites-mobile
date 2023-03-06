import {
  withPageAuthRequired as auth0WithPageAuthRequired,
  withApiAuthRequired as auth0WithApiAuthRequired,
} from '@auth0/nextjs-auth0';

export function withPageAuthRequired(
  ...parameters: Parameters<typeof auth0WithPageAuthRequired>
) {
  return process.env.AUTH0_DISABLED
    ? undefined
    : auth0WithPageAuthRequired(...parameters);
}

export function withApiAuthRequired(handler: () => void) {
  return process.env.AUTH0_DISABLED
    ? handler
    : auth0WithApiAuthRequired(handler);
}
