if (!localStorage.getItem('modelTexturesId')) {
  localStorage.setItem('modelTexturesId', '101');
}

if (!localStorage.getItem('modelId')) {
  localStorage.setItem('modelId', '2');
}

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag;

    if (type === 'css') {
      tag = document.createElement('link');
      tag.rel = 'stylesheet';
      tag.href = url;
    }
    else if (type === 'js') {
      tag = document.createElement('script');
      tag.type = 'module';
      tag.src = url;
    }
    if (tag) {
      tag.onload = () => resolve(url);
      tag.onerror = () => reject(url);
      document.head.appendChild(tag);
    }
  });
}

// 加载 live2d.min.js waifu.css waifu-tips.js
// 如果担心手机上显示效果不佳，可以通过 `if (screen.width >= 768)` 来判断是否加载
(async () => {
  await Promise.all([
    loadExternalResource(/js/ + 'waifu.css', 'css'),
    loadExternalResource(/js/ + 'waifu-tips.js', 'js')
  ]);

  // 配置选项的具体用法见 README.md
  initWidget({
    waifuPath: /js/ + 'waifu-tips.json',
    cdnPath: '/js/',
    cubism2Path: /js/ + 'live2d.min.js',
    cubism5Path: 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
    // tools: ['hitokoto', 'asteroids', 'switch-model', 'switch-texture', 'photo', 'info', 'quit'],
    tools: ['quit'],
    logLevel: 'warn',
    drag: true,
  });
})();

// console.log(`\n%cLive2D%cWidget%c\n`, 'padding: 8px; background: #cd3e45; font-weight: bold; font-size: large; color: white;', 'padding: 8px; background: #ff5450; font-size: large; color: #eee;', '');
// console.log(`
// Source: https://github.com/stevenjoezhang/live2d-widget
//
// く__,.ヘヽ.        /  ,ー､ 〉
//          ＼ ', !-─‐-i  /  /´
//          ／｀ｰ'       L/／｀ヽ､
//        /   ／,   /|   ,   ,       ',
//      ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
//       ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
//         !,/7 '0'     ´0iソ|    |
//         |.从"    _     ,,,, / |./    |
//         ﾚ'| i＞.､,,__  _,.イ /   .i   |
//           ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
//             | |/i 〈|/   i  ,.ﾍ |  i  |
//            .|/ /  ｉ：    ﾍ!    ＼  |
//             kヽ>､ﾊ    _,.ﾍ､    /､!
//             !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
//             ﾚ'ヽL__|___i,___,ンﾚ|ノ
//                 ﾄ-,/  |___./
//                 'ｰ'    !_,.:
// `);
