import passport from 'passport'

export function configureAuthRoutes(app, authURL, callbackURL) {
  app.get(authURL, passport.authenticate('auth0', {
    connection: 'google-oauth2',
    scope: 'openid email',
  }))

  app.get(callbackURL,
    passport.authenticate('auth0', {failureRedirect: '/'}),
    (req, res, next) => {
      if (!req.user) {
        throw new Error('authentication failed!')
      }
      res.cookie('jwt', req.user.idToken, {secure: process.env.NODE_ENV === 'production', httpOnly: true})
      next()
    }
  )
}
