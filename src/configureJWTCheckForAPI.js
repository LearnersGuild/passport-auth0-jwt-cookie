import jwt from 'express-jwt'

export function configureJWTCheckForAPI(app, clientID, clientSecret, ignorePaths = []) {
  // Ensure that the caller has a valid JWT token to access this API.
  const jwtCheck = jwt({
    audience: clientID,
    secret: new Buffer(clientSecret, 'base64'),
  }).unless({
    path: ignorePaths,
  })
  app.use(jwtCheck)
}
