'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureAuth0;

var _configureAuth0Strategy = require('./configureAuth0Strategy');

var _configureAuthRoutes = require('./configureAuthRoutes');

var _configureJWTCheckForAPI = require('./configureJWTCheckForAPI');

var _configureRequestUserFromJWT = require('./configureRequestUserFromJWT');

function configureAuth0(app, _ref) {
  var domain = _ref.domain;
  var clientID = _ref.clientID;
  var clientSecret = _ref.clientSecret;
  var authURL = _ref.authURL;
  var callbackURL = _ref.callbackURL;
  var jwtIgnorePaths = _ref.jwtIgnorePaths;

  if (!domain || !clientID || !clientSecret || !authURL || !callbackURL) {
    throw new Error("Required options: domain, clientID, clientSecret, authURL, callbackURL");
  }

  // all API calls need a proper JWT
  (0, _configureJWTCheckForAPI.configureJWTCheckForAPI)(app, clientID, clientSecret, jwtIgnorePaths);
  // if a JWT cookie is found, grab the user from Auth0 and attach it to the request for
  // server-side rendering
  (0, _configureRequestUserFromJWT.configureRequestUserFromJWT)(app, domain);
  // set up passport for Auth0
  (0, _configureAuth0Strategy.configureAuth0Strategy)(app, domain, clientID, clientSecret, callbackURL);
  // route handlers for authentication via Auth0 (OAuth2)
  (0, _configureAuthRoutes.configureAuthRoutes)(app, authURL, callbackURL);
}
module.exports = exports['default'];