(function () {
  const qa = new Set(JSON.parse('[]'));
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
      console.log(questions[i].replace(/(_{2,})/, answer));
      questions[i] = questions[i].replace(/(_{2,})/, `<u>${answer}</u>`);
    } else {
      // 没有填空或多个填空
      questions[i] += ` <u>${answer}</u>`;
    }
    // 加入题集
    qa.add(questions[i]);
  }
  // 输出题集
  console.log(JSON.stringify(Array.from(qa)));
})();
