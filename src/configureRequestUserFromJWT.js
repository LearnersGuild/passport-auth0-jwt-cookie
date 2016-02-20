/* eslint-disable camelcase */
import fetch from 'isomorphic-fetch'

export function configureRequestUserFromJWT(app, domain) {
  app.use(async (req, res, next) => {
    if (!req.cookies || !req.cookies.jwt) {
      return next()
    }

    try {
      const idToken = req.cookies.jwt
      const profile = await fetch(`https://${domain}/tokeninfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_token: idToken,
        })
      }).then(resp => {
        if (resp.status !== 200) {
          res.clearCookie('jwt')
          throw new Error("Couldn't get user profile using JWT. Most likely it expired.")
        }
        return resp.json()
      })

      req.user = {idToken, profile}
      next()
    } catch (err) {
      console.error(err)
      next()
    }
  })
}
