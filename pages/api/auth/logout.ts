import { handleLogout } from '@auth0/nextjs-auth0'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = (req, res) => {
  const { returnTo } = req.query
  return handleLogout(req, res, {
    returnTo: Array.isArray(returnTo) ? returnTo[0] : returnTo
  })
}

export default handler