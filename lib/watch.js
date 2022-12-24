const path = require('path');
const fs = require('fs');
const watch = require('watch');
const confidentialDirPath = path.resolve('docs/assets/confidential');
const encode = require('./encode');

watch.watchTree(confidentialDirPath, function (f, curr, prev) {
  if (typeof f == 'object' && prev === null && curr === null) {
    console.log('confidential watching...');
    // Finished walking the tree
  } else if (prev === null) {
    // f is a new file
    encode(f);
  } else if (curr.nlink === 0) {
    // f was removed
    const filePathStat = fs.statSync(f);
    if (filePathStat.isFile()) {
      fs.unlinkSync(f.replace('.mdx', '.md'));
    }
  } else {
    encode(f);
  }
});
