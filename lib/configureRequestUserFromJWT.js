'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureRequestUserFromJWT = configureRequestUserFromJWT;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable camelcase */


function configureRequestUserFromJWT(app, domain) {
  var _this2 = this;

  app.use(function () {
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
      }, _callee, _this2, [[2, 11]]);
    })),
        _this = _this2;

    return function (_x, _x2, _x3) {
      return ref.apply(_this, arguments);
    };
  }());
}