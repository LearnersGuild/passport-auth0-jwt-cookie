/* eslint-disable camelcase */
import passport from 'passport'
import jwt from 'express-jwt'
import fetch from 'isomorphic-fetch'

export const authMiddleware = passport.authenticate('auth0', {
  connection: 'google-oauth2',
  scope: 'openid email',
})

export const getCallbackMiddleware = failureRedirect => passport.authenticate('auth0', {failureRedirect})

export const setCookieMiddleware = (req, res, next) => {
  if (!req.user) {
    throw new Error('authentication failed!')
  }
  res.cookie('jwt', req.user.idToken, {secure: process.env.NODE_ENV === 'production', httpOnly: true})
  next()
}

export const getJWTCheckMiddleware = (clientID, clientSecret) => {
  return jwt({
    audience: clientID,
    secret: new Buffer(clientSecret, 'base64'),
  })
}

export const getUserFromJWTMiddleware = domain => {
  return async (req, res, next) => {
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
  }
}
