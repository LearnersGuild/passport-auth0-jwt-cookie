'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureJWTCheckForAPI = configureJWTCheckForAPI;

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureJWTCheckForAPI(app, clientID, clientSecret) {
  var apiPaths = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

  // Ensure that the caller has a valid JWT token to access this API.
  var jwtCheck = (0, _expressJwt2.default)({
    audience: clientID,
    secret: new Buffer(clientSecret, 'base64')
  });
  apiPaths.forEach(function (path) {
    return app.use(path, jwtCheck);
  });
}