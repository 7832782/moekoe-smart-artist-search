// == MoeKoe Smart Artist Search - Content Script ==
(function () {
  'use strict';

  if (document.documentElement.dataset.moekoeArtistSearchReady) return;
  console.log('[MoeKoe Smart Artist Search] 插件已加载');

  // =============================================
  //  1. 注入 hook.js（主世界脚本，绕过 CSP）
  // =============================================
  function injectHook() {
    try {
      var hookUrl = chrome.runtime.getURL('hook.js');
      var script = document.createElement('script');
      script.src = hookUrl;
      script.onload = function () {
        console.log('[MoeKoe Smart Artist Search] hook.js 已加载');
        document.documentElement.dataset.moekoeArtistSearchReady = '1';
      };
      script.onerror = function () {
        console.error('[MoeKoe Smart Artist Search] hook.js 加载失败:', hookUrl);
      };
      document.documentElement.appendChild(script);
    } catch (e) {
      console.error('[MoeKoe Smart Artist Search] Hook 注入失败:', e);
    }
  }

  // =============================================
  //  2. 注入 CSS
  // =============================================
  function injectStyle() {
    if (document.querySelector('#moekoe-artist-search-style')) return;
    var style = document.createElement('style');
    style.id = 'moekoe-artist-search-style';
    style.textContent =
      '.moekoe-artist-menu{' +
        'position:fixed;z-index:999999;' +
        'background:#181818;' +
        'border:1px solid #333;' +
        'border-radius:10px;' +
        'padding:4px;' +
        'min-width:110px;' +
        'box-shadow:0 8px 32px rgba(0,0,0,0.5);' +
        'overflow:hidden;' +
        'animation:moekoeArtistFadeIn 0.12s ease;' +
      '}' +
      '.moekoe-artist-menu-item{' +
        'padding:7px 14px;' +
        'cursor:pointer;' +
        'color:#e1e1e1;' +
        'font-size:13px;' +
        'border-radius:6px;' +
        'transition:background 0.1s;' +
        'white-space:nowrap;' +
        'user-select:none;' +
      '}' +
      '.moekoe-artist-menu-item:hover{' +
        'background:#252525;' +
      '}' +
      '.moekoe-artist-menu-item:active{' +
        'background:rgba(74,144,226,0.25);' +
      '}' +
      '@keyframes moekoeArtistFadeIn{' +
        'from{opacity:0;transform:translateY(-3px) scale(0.97)}' +
        'to{opacity:1;transform:translateY(0) scale(1)}' +
      '}';
    document.head.appendChild(style);
  }

  // =============================================
  //  3. 调试：打印当前 hash（仅首次）
  // =============================================
  console.log('[MoeKoe Smart Artist Search] 当前 hash:', window.location.hash);

  // =============================================
  //  4. Init
  // =============================================
  injectStyle();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHook);
  } else {
    injectHook();
  }
})();
