'use strict';

const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');
const { key, iv } = require('./key');

const confidentialDirPath = path.resolve('src/confidential');
const targetDirPath = path.resolve('docs/assets/confidential');

fs.readdirSync(targetDirPath).forEach(function (filename) {
  if (!filename.endsWith('.md')) return;
  const filePath = path.join(targetDirPath, filename);
  const filePathStat = fs.statSync(filePath);
  if (filePathStat.isFile()) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const raw = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(content) }, key, iv);
    const decodeed = CryptoJS.enc.Utf8.stringify(raw);
    fs.writeFileSync(
      path.join(confidentialDirPath, filename.replace('.md', '.mdx')),
      decodeed,
      'utf-8'
    );
  }
});
