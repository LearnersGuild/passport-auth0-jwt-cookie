'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureAuth0Strategy = configureAuth0Strategy;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportAuth = require('passport-auth0');

var _passportAuth2 = _interopRequireDefault(_passportAuth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureAuth0Strategy(app, domain, clientID, clientSecret, callbackURL) {
  var strategy = new _passportAuth2.default({
    domain: domain,
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL
  }, function (accessToken, refreshToken, extraParams, profile, done) {
    var user = { accessToken: accessToken, idToken: extraParams.id_token, profile: profile._json };
    return done(null, user);
  });

  _passport2.default.serializeUser(function (user, done) {
    return done(null, user);
  });
  _passport2.default.deserializeUser(function (user, done) {
    return done(null, user);
  });
  _passport2.default.use(strategy);
  app.use(_passport2.default.initialize());
}