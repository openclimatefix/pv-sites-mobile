import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuthRequired(async function token(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const accessToken = await getAccessToken(req, res);
    res.status(200).json(accessToken);
  } catch (error: any) {
    res.status(error.status || 400).end(error.message);
  }
});
