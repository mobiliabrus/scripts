/*
const list = [];
const a = document.querySelectorAll('#modal-body-zwws a');
for (let i = 0; i < a.length; i++) {
  const href = a[i].href;
  const text = a[i].textContent.replace('下载', '');
  list.push({ href, text });
}
console.log(JSON.stringify(list));
*/

const http = require('http');
const fs = require('fs');
const path = require('path');
const t = require('./t.json');

let i = 0;
const download = () => {
  if (!t[i]) return;
  const file = t[i].href;
  const text = t[i].text;
  console.log('download', file, text);

  return new Promise((resolve) => {
    const target = path.join(__dirname, './download', text + '.doc');
    if (!fs.existsSync(target)) {
      http.get(file, (res) => {
        const stream = fs.createWriteStream(target);
        res.pipe(stream);
        i++;
        resolve();
      })
    } else {
      i++;
      resolve();
    }
  }).then(download);
};

download();