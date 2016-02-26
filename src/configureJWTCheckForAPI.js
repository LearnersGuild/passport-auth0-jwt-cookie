import jwt from 'express-jwt'

export function configureJWTCheckForAPI(app, clientID, clientSecret, apiPaths = []) {
  // Ensure that the caller has a valid JWT token to access this API.
  const jwtCheck = jwt({
    audience: clientID,
    secret: new Buffer(clientSecret, 'base64'),
  })
  apiPaths.forEach(path => app.use(path, jwtCheck))
}
