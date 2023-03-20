import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function token(req, res) {
  console.log('Running get token body...');

  try {
    const accessToken = await getAccessToken(req, res);
    res.status(200).json(accessToken);
  } catch (error: any) {
    res.status(error.status || 400).end(error.message);
  }
});
