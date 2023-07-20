window._key_ = 't1-4';
window.__a__ = [];

if (localStorage.getItem(window._key_)) {
  try {
    window.__a__ = JSON.parse(localStorage.getItem(window._key_));
  } catch (e) {
    //
  }
}

;(function () {
  const before = window.__a__.length;
  const qa = new Set(window.__a__);
  // 抓取问题
  const questions = Array.prototype.map.call(document.querySelectorAll('.jx_tmtit'), (node) =>
    node.children[0].innerText.replace(/^\d+、/, '')
  );
  // 抓取正确选择
  const choices = Array.prototype.map.call(
    document.querySelectorAll('.jx_zqda'),
    (node) => /[A-D]/.exec(node.children[1].innerText)[0].charCodeAt(0) - 'A'.charCodeAt(0)
  );
  // 抓取备选答案
  const answers = Array.prototype.map.call(
    document.querySelectorAll('.jx_xqtm p'),
    (node) => node.innerText.split('、')[1]
  );
  // 组合问题和答案
  for (let i = 0; i < questions.length; i++) {
    // 答案
    const answer = answers.splice(0, 4)[choices[i]];
    // 查找填空
    const blanks = questions[i].match(/(_{2,})/g) && questions[i].match(/(_{2,})/g).length;
    if (blanks === 1) {
      // 只有一个填空
      questions[i] = questions[i].replace(/(_{2,})/, `<u>${answer}</u>`);
    } else {
      // 没有填空或多个填空
      questions[i] += ` <u>${answer}</u>`;
    }
    // 加入题集
    qa.add(questions[i]);
  }
  // 输出题集
  const after = Array.from(qa).length;
  if (after > before) {
    console.log(`${before} -> ${after}`);
    window.__a__ = Array.from(qa).sort();
  } else {
    console.log('nothing changed.');
  }
  console.log(JSON.stringify(window.__a__).replaceAll("'", "\\'").replaceAll('"', '\''));
})();

localStorage.setItem(window._key_, JSON.stringify(window.__a__));
