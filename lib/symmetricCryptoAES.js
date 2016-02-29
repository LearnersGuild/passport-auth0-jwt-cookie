'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = encrypt;
exports.decrypt = decrypt;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STATE_SECRET = _crypto2.default.randomBytes(16);
var INIT_VECTOR = _crypto2.default.randomBytes(16);

function encrypt(plaintext) {
  var cipher = _crypto2.default.createCipheriv('aes-128-cbc', STATE_SECRET, INIT_VECTOR);
  // console.log('plaintext:', plaintext)
  var encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  // console.log('encrypted:', encrypted)
  return encrypted;
}

function decrypt(encrypted) {
  var decipher = _crypto2.default.createDecipheriv('aes-128-cbc', STATE_SECRET, INIT_VECTOR);
  // console.log('encrypted:', encrypted)
  var plaintext = decipher.update(encrypted, 'base64', 'utf8');
  plaintext += decipher.final('utf8');
  // console.log('plaintext:', plaintext)
  return plaintext;
}