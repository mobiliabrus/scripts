const CryptoJS = require('crypto-js');
const password = require("../../../../password.json");
const keylength = 16;
const keyorigin = password.split("");
const key16 = keyorigin.length < 16 ? [...keyorigin, ...Array.from(new Array(keylength - keyorigin.length)).map(() => "0")].join("") : key16;
const keyutf = CryptoJS.enc.Utf8.parse(key16);
const iv = { iv: CryptoJS.enc.Base64.parse(key16) };

module.exports = {
  key: keyutf,
  iv,
};
