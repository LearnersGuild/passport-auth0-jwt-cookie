'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureAuthRoutes = configureAuthRoutes;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureAuthRoutes(app, authURL, callbackURL) {
  app.get(authURL, _passport2.default.authenticate('auth0', {
    connection: 'google-oauth2',
    scope: 'openid email'
  }));

  app.get(callbackURL, _passport2.default.authenticate('auth0', { failureRedirect: '/' }), function (req, res) {
    if (!req.user) {
      throw new Error('authentication failed!');
    }
    res.cookie('jwt', req.user.idToken, { secure: process.env.NODE_ENV === 'production', httpOnly: true });
    res.redirect('/');
  });
}