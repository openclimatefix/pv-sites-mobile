namespace NodeJS {
  interface ProcessEnv {
    MAPBOX_SECRET: string;
    MAPBOX_PUBLIC: string;
    AUTH0_SECRET: string;
    AUTH0_BASE_URL: string;
    AUTH0_ISSUER_BASE_URL: string;
    AUTH0_CLIENT_ID: string;
    AUTH0_CLIENT_SECRET: string;
    AUTH0_AUDIENCE: string;
    NEXT_PUBLIC_MAPBOX_PUBLIC: string;
    NEXT_PUBLIC_AUTH0_LOGOUT_REDIRECT: string;
    NEXT_PUBLIC_BASE_URL: string;
    NEXT_PUBLIC_API_BASE_URL_POST: string;
    NEXT_PUBLIC_API_BASE_URL_GET: string;
    ENODE_ACCESS_TOKEN_URL: string;
    ENODE_BASE_URL: string;
  }
}
