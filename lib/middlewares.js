'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserFromJWTMiddleware = exports.getJWTCheckMiddleware = exports.setCookieMiddleware = exports.getCallbackMiddleware = exports.authMiddleware = undefined;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _symmetricCryptoAES = require('./symmetricCryptoAES');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable camelcase */


var authMiddleware = exports.authMiddleware = function authMiddleware(req, res) {
  // if the app passed-in a place to which we should redirect after the
  // authentication, we'll use it as part of the OAuth2 'state' parameter
  var redirectTo = req.query.redirectTo;

  var appState = {};
  if (redirectTo) {
    appState.redirectTo = redirectTo;
  }
  appState = JSON.stringify(appState);
  _passport2.default.authenticate('auth0', {
    connection: 'google-oauth2',
    scope: 'openid email',
    state: (0, _symmetricCryptoAES.encrypt)(appState)
  })(req, res);
};

var getCallbackMiddleware = exports.getCallbackMiddleware = function getCallbackMiddleware(failureRedirect) {
  return function (req, res, next) {
    // if the app passed-in a place to which we should redirect after the
    // authentication, we'll use it as part of the OAuth2 'state' parameter
    var state = req.query.state;

    var appState = JSON.parse((0, _symmetricCryptoAES.decrypt)(state));
    // set our app state (including redirectTo)
    req.appState = appState;
    _passport2.default.authenticate('auth0', { failureRedirect: failureRedirect })(req, res, next);
  };
};

var setCookieMiddleware = exports.setCookieMiddleware = function setCookieMiddleware(req, res, next) {
  if (!req.user) {
    throw new Error('authentication failed!');
  }
  res.cookie('jwt', req.user.idToken, { secure: process.env.NODE_ENV === 'production', httpOnly: true });
  next();
};

var getJWTCheckMiddleware = exports.getJWTCheckMiddleware = function getJWTCheckMiddleware(clientID, clientSecret) {
  return (0, _expressJwt2.default)({
    audience: clientID,
    secret: new Buffer(clientSecret, 'base64')
  });
};

var getUserFromJWTMiddleware = exports.getUserFromJWTMiddleware = function getUserFromJWTMiddleware(domain) {
  return function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
      var idToken, profile;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(!req.cookies || !req.cookies.jwt)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return', next());

            case 2:
              _context.prev = 2;
              idToken = req.cookies.jwt;
              _context.next = 6;
              return (0, _isomorphicFetch2.default)('https://' + domain + '/tokeninfo', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  id_token: idToken
                })
              }).then(function (resp) {
                if (resp.status !== 200) {
                  res.clearCookie('jwt');
                  throw new Error("Couldn't get user profile using JWT. Most likely it expired.");
                }
                return resp.json();
              });

            case 6:
              profile = _context.sent;


              req.user = { idToken: idToken, profile: profile };
              next();
              _context.next = 15;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context['catch'](2);

              console.error(_context.t0);
              next();

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[2, 11]]);
    })),
        _this = undefined;

    return function (_x, _x2, _x3) {
      return ref.apply(_this, arguments);
    };
  }();
};