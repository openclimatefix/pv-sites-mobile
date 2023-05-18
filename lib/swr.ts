let accessToken: string | undefined;

/**
 * Our general SWR fetcher function that is authorized for the API
 * @param url A url to fetch
 * @returns the JSON response
 */
export async function fetcher(url: string) {
  const options = await getAuthenticatedRequestOptions(url);
  const res = await fetch(url, options);
  return await res.json();
}

export async function getAuthenticatedRequestOptions(url: string) {
  let options: RequestInit = {};
  if (
    url.startsWith(process.env.NEXT_PUBLIC_API_BASE_URL_GET) ||
    url.startsWith(process.env.NEXT_PUBLIC_API_BASE_URL_POST)
  ) {
    if (!accessToken) {
      accessToken = (await fetch('/api/get_token').then((res) => res.json()))
        .accessToken;
    }

    options = {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  return options;
}
