const fs = require('fs');
const path = require('path');

const imgDocs = path.resolve('./docs/assets/');
const bookDocs = path.resolve('../tourbook/docs');

function readFolderSync(root, test) {
  let result = [];
  const list = fs.readdirSync(root);
  list.forEach((t) => {
    const target = path.join(root, t);
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      result = result.concat(readFolderSync(target, test));
    } else if (!t.startsWith('.')) {
      if (test instanceof RegExp) {
        if (test.test(target) === true) {
          result.push(target);
        }
      } else {
        result.push(target);
      }
    }
  });
  return result;
}

const imgResult = readFolderSync(imgDocs, /\/[^.]+\.[^.]+$/);
const bookResult = readFolderSync(bookDocs, /.mdx?$/).map((filename) => ({
  filename: path.basename(filename),
  content: fs.readFileSync(filename, 'utf-8'),
}));

const usage = {};
imgResult.forEach((img) => {
  const [dir, basename] = img.split('/').slice(-2);
  let name, result;
  switch (dir) {
    case 'public':
      name = basename.split('.')[0];
      result = [];
      bookResult.forEach((file) => {
        const matches = file.content.match(
          new RegExp(
            `(<a-img>\nname:${name}\n\`\`\`)|(<a-img name="${name}")|({name:'${name}'})`,
            'g'
          )
        );
        if (matches !== null) {
          result.push({ filename: file.filename, count: matches.length });
        }
      });
      usage[path.join(dir, basename)] = result;
      break;
    case 'privacy':
      result = [];
      const dirString = basename.endsWith('.gif') ? 'privacy-gif' : 'privacy';
      bookResult.forEach((file) => {
        const matches = file.content.match(
          new RegExp(
            `(<a-img>\nname:${basename}\ndir:${dirString}\n)|(<a-img name="${basename}" dir="${dirString}")|({name:'${basename}',dir:'${dirString}'})`,
            'g'
          )
        );
        if (matches !== null) {
          result.push({ filename: file.filename, count: matches.length });
        }
      });
      usage[path.join(dir, basename)] = result;
      break;
    case 'animation':
      name = basename.split('.')[0];
      result = [];
      bookResult.forEach((file) => {
        const matches = file.content.match(
          new RegExp(
            `(<a-img>\nname:${name}\ndir:${dir}\n)|(<a-img name="${name}" dir="${dir}")|({name:'${name}', dir:'${dir}'})`,
            'g'
          )
        );
        if (matches !== null) {
          result.push({ filename: file.filename, count: matches.length });
        }
      });
      usage[path.join(dir, basename)] = result;
      break;
    default:
      console.log('Unhandled file:', dir, basename);
  }
});

Object.keys(usage).forEach((img) => {
  if (usage[img].length === 0) {
    console.log(img, 'seems not used.');
  } else {
    if (usage[img].length > 1) {
      console.log(img, 'seems used in', usage[img].length, 'files.');
    }
    usage[img].forEach((f) => {
      if (f.count > 1) {
        console.log(img, 'seems used in', f.filename, 'for', f.count, 'times.');
      }
    });
  }
});
