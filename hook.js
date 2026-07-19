// == MoeKoe Smart Artist Search - Hook (runs in main world) ==
// 拦截 .artist 点击，按顿号分割歌手，弹出选择菜单
(function () {
  'use strict';

  var MENU_CLASS = 'moekoe-artist-menu';
  var ITEM_CLASS = 'moekoe-artist-menu-item';

  // =============================================
  //  工具：关闭菜单
  // =============================================
  function removeMenu() {
    var old = document.querySelector('.' + MENU_CLASS);
    if (old) old.remove();
  }

  // =============================================
  //  工具：触发搜索（通过 hash 路由）
  // =============================================
  function searchArtist(name) {
    var encoded = encodeURIComponent(name);
    // MoeKoe 使用 Vue Router hash 模式，搜索路由是 #/search?q=xxx
    window.location.hash = '#/search?q=' + encoded;
  }

  // =============================================
  //  创建悬浮菜单
  // =============================================
  function showArtistMenu(artists, clickX, clickY) {
    removeMenu();

    var menu = document.createElement('div');
    menu.className = MENU_CLASS;

    artists.forEach(function (name) {
      var item = document.createElement('div');
      item.className = ITEM_CLASS;
      item.textContent = name;
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        removeMenu();
        searchArtist(name);
      });
      menu.appendChild(item);
    });

    // 先加到 body 里才能获取尺寸
    document.body.appendChild(menu);

    // 调整位置，防止溢出视口
    var rect = menu.getBoundingClientRect();
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var left = clickX;
    var top = clickY;

    // 右溢出
    if (left + rect.width + 8 > vw) {
      left = vw - rect.width - 8;
    }
    // 下溢出
    if (top + rect.height + 8 > vh) {
      top = clickY - rect.height - 4;
    }
    // 左溢出
    if (left < 4) left = 4;
    // 上溢出
    if (top < 4) top = 4;

    menu.style.left = left + 'px';
    menu.style.top = top + 'px';

    // 点击菜单外部关闭
    var closeHandler = function (e) {
      if (!menu.contains(e.target)) {
        removeMenu();
        document.removeEventListener('click', closeHandler, true);
      }
    };
    // 用 capture 阶段确保捕获到所有点击
    setTimeout(function () {
      document.addEventListener('click', closeHandler, true);
    }, 0);
  }

  // =============================================
  //  Capture 阶段拦截 .artist 点击
  // =============================================
  document.addEventListener(
    'click',
    function (e) {
      var target = e.target;
      // 允许点击菜单项冒泡到这里时放行
      if (target.closest('.' + MENU_CLASS)) return;

      var artistEl = target.closest('.artist');
      if (!artistEl) return;

      var text = artistEl.textContent.trim();
      // 不包含顿号 → 放行默认行为
      if (!text || text.indexOf('、') === -1) return;

      var artists = text
        .split('、')
        .map(function (s) { return s.trim(); })
        .filter(Boolean);

      if (artists.length <= 1) return;

      // 阻止 Vue 的事件处理
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      showArtistMenu(artists, e.clientX, e.clientY);
    },
    true
  ); // capture: true

  console.log('[MoeKoe Smart Artist Search Hook] 已安装');
})();
