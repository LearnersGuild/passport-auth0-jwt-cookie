import {configureAuth0Strategy} from './configureAuth0Strategy'
import {configureAuthRoutes} from './configureAuthRoutes'
import {configureJWTCheckForAPI} from './configureJWTCheckForAPI'
import {configureRequestUserFromJWT} from './configureRequestUserFromJWT'

export default function configureAuth0(app, {domain, clientID, clientSecret, authURL, callbackURL, jwtAPIPaths}) {
  if (!domain || !clientID || !clientSecret || !authURL || !callbackURL) {
    throw new Error('Required options: domain, clientID, clientSecret, authURL, callbackURL')
  }

  // all API calls need a proper JWT
  configureJWTCheckForAPI(app, clientID, clientSecret, jwtAPIPaths)
  // if a JWT cookie is found, grab the user from Auth0 and attach it to the request for
  // server-side rendering
  configureRequestUserFromJWT(app, domain)
  // set up passport for Auth0
  configureAuth0Strategy(app, domain, clientID, clientSecret, callbackURL)
  // route handlers for authentication via Auth0 (OAuth2)
  configureAuthRoutes(app, authURL, callbackURL)
}
