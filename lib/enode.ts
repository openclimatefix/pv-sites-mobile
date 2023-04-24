// THIS FILE WILL BE REMOVED, all functions will be implemented in the pv-site-api repo
import { redis } from './redis';

const enodeBaseURL = process.env.ENODE_BASE_URL;

export const testClientID = 'few434g3';

// Cache Enode access token in memory
let cachedAccessToken: string | undefined;

export async function clearUsers(userIDs: string[]) {
  for (const userID of userIDs) {
    enodeFetch(`/users/${userID}/authorization`, {
      method: 'DELETE',
    });
  }
}

export type Inverter = {
  id: string;
  vendor: string;
  chargingLocationId: string | null;
  lastSeen: string;
  isReachable: boolean;
  productionState: {
    productionRate: number | null;
    isProducing: boolean | null;
    totalLifetimeProduction: number | null;
    lastUpdated: string | null;
  };
  information: {
    id: string;
    brand: string;
    model: string;
    siteName: string;
    installationDate: string;
  };
  location: {
    longitude: number | null;
    latitude: number | null;
  };
};

export type Inverters = {
  inverters: Inverter[];
};

export async function getInverters(userID: string) {
  const inverterIDs = (await enodeFetch('/inverters', {
    method: 'GET',
    headers: {
      'Enode-User-Id': userID,
    },
  }).then((res) => res.json())) as string[];

  if (!inverterIDs.length) {
    return null;
  }

  const inverters = await Promise.all(
    inverterIDs.map((inverterID) =>
      enodeFetch(`/inverters/${inverterID}`, {
        headers: { 'Enode-User-Id': userID },
      }).then((res) => res.json())
    )
  );

  return inverters;
}

type Vendor = {
  vendor: string;
  isValid: boolean;
};
export async function getLinkedVendors(userID: string) {
  const { linkedVendors } = (await enodeFetch('/me', {
    method: 'GET',
    headers: {
      'Enode-User-Id': userID,
    },
  }).then((res) => res.json())) as { linkedVendors: Vendor[] };

  return linkedVendors;
}

export async function getLinkRedirectURL(userID: string, redirectURL: string) {
  const { linkUrl } = (await enodeFetch(`/users/${userID}/link`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      vendorType: 'inverter',
      redirectUri: redirectURL, // Could use a different redirect url later
    }),
  }).then((res) => res.json())) as { linkUrl: string };

  return linkUrl;
}

async function enodeFetch(...parameters: Parameters<typeof fetch>) {
  const accessToken = await getAccessToken();
  let [url, requestInit] = parameters;
  url = enodeBaseURL + url;
  requestInit ??= {};
  requestInit.headers = {
    ...requestInit?.headers,
    authorization: `Bearer ${accessToken}`,
  };

  let response = await fetch(url, requestInit);

  // Token expired
  if (response.status === 401) {
    const accessToken = await refreshAccessToken();
    (
      requestInit.headers as Record<string, string>
    ).authorization = `Bearer ${accessToken}`;

    response = await fetch(url, requestInit);
  }

  return response;
}

const redisAccessTokenKey = 'ENODE_ACCESS_TOKEN';
async function getAccessToken() {
  let accessToken =
    cachedAccessToken ||
    ((await redis.get(redisAccessTokenKey)) as string | undefined);

  if (!accessToken) {
    accessToken = await refreshAccessToken();
  }
  return accessToken;
}

async function refreshAccessToken() {
  let accessToken: string;
  try {
    accessToken = await fetchAccessToken();
  } catch {
    return '';
  }
  cachedAccessToken = accessToken;
  await redis.set(redisAccessTokenKey, accessToken);
  return accessToken;
}

const enodeAccessTokenURL = process.env.ENODE_ACCESS_TOKEN_URL;
async function fetchAccessToken() {
  const { access_token } = (await fetch(enodeAccessTokenURL, {
    method: 'POST',
    headers: {
      authorization: `Basic ${process.env.ENODE_CLIENT_TOKEN}`,
      accept: '*/*',
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  }).then((res) => res.json())) as {
    access_token: string;
  };

  if (!access_token) {
    throw Error('Access token request failed.');
  }

  return access_token;
}
