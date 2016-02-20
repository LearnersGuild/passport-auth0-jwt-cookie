import passport from 'passport'
import Auth0Strategy from 'passport-auth0'

export function configureAuth0Strategy(app, domain, clientID, clientSecret, callbackURL) {
  const strategy = new Auth0Strategy({
    domain,
    clientID,
    clientSecret,
    callbackURL,
  }, (accessToken, refreshToken, extraParams, profile, done) => {
    const user = {accessToken, idToken: extraParams.id_token, profile: profile._json}
    return done(null, user)
  })

  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => done(null, user))
  passport.use(strategy)
  app.use(passport.initialize())
}
