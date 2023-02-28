import { withPageAuthRequired as auth0WithPageAuthRequired } from '@auth0/nextjs-auth0';

export function withPageAuthRequired() {
  return process.env.AUTH0_DISABLED ? undefined : auth0WithPageAuthRequired();
}
