/* eslint-disable camelcase */
import passport from 'passport'
import jwt from 'express-jwt'
import fetch from 'isomorphic-fetch'

import {encrypt, decrypt} from './symmetricCryptoAES'

export const authMiddleware = (req, res) => {
  // if the app passed-in a place to which we should redirect after the
  // authentication, we'll use it as part of the OAuth2 'state' parameter
  const {redirectTo} = req.query
  let appState = {}
  if (redirectTo) {
    appState.redirectTo = redirectTo
  }
  appState = JSON.stringify(appState)
  passport.authenticate('auth0', {
    connection: 'google-oauth2',
    scope: 'openid email',
    state: encrypt(appState),
  })(req, res)
}

export const getCallbackMiddleware = failureRedirect => {
  return (req, res, next) => {
    // if the app passed-in a place to which we should redirect after the
    // authentication, we'll use it as part of the OAuth2 'state' parameter
    const {state} = req.query
    const appState = JSON.parse(decrypt(state))
    // set our app state (including redirectTo)
    req.appState = appState
    passport.authenticate('auth0', {failureRedirect})(req, res, next)
  }
}

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
