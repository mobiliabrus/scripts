window.__a__ = {}

;(function () {
  const count = () => {
    let c = 0;
    for (const t in window.__a__) {
      if (Array.isArray(window.__a__[t].questions)) {
        c += window.__a__[t].questions.length;
      }
    }
    return c;
  };
  const before = count();
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
  // 抓取问题
  document.querySelectorAll('.jx_tmtit').forEach((node, i) => {
    const [title, ...text] = node.children[0].innerText.replace(/^\d+、/, '').split('\n');
    let question = text.splice(-1)[0];
    if (!window.__a__[title]) window.__a__[title] = { text, questions: [] };
    // 答案
    const answer = answers.splice(0, 4)[choices[i]];
    // 查找填空
    const blanks = question.match(/(_{2,})/g) && question.match(/(_{2,})/g).length;
    if (blanks === 1) {
      // 只有一个填空
      question = question.replace(/(_{2,})/, `<u>${answer}</u>`);
    } else {
      // 没有填空或多个填空
      question += ` <u>${answer}</u>`;
    }
    // 追加题目
    window.__a__[title].questions = Array.from(
      new Set(window.__a__[title].questions).add(question)
    );
  });
  const after = count();
  if (after > before) {
    console.log(`${before} -> ${after}`);
    console.log(JSON.stringify(window.__a__));
  } else {
    console.log('nothing changed.');
  }
})();
