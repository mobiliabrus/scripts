'use strict';

const fs = require('fs');
const CryptoJS = require('crypto-js');
const { key, iv } = require('./key');

function encode(filename) {
  if (filename.endsWith('.mdx')) {
    const filePath = filename;
    const targetPath = filename.replace('.mdx','.md');
    const filePathStat = fs.statSync(filePath);
    if (filePathStat.isFile()) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const encodeed = CryptoJS.AES.encrypt(content, key, iv).toString();
      fs.writeFileSync(targetPath, encodeed, 'utf-8');
      console.log(`${filename} encoded.`);
    }
  }
}

if (process.argv[2]) {
  encode(process.argv[2]);
}

module.exports = encode;
