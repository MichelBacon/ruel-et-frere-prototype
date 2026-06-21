// ===== Prototype theme propagation =====
// Keeps the chosen prototype's look (colors, fonts) across every inner page.
// Resolution order: explicit data-theme on <html> (the prototype homepages)
//   > ?t= URL param > localStorage > default "1".
(function(){
  var FONT = {
    '2':'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Space+Grotesk:wght@400;500;600;700&display=swap',
    '3':'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap'
  };
  var root = document.documentElement;
  var explicit = root.getAttribute('data-theme');           // set on prototype-N pages
  var param = new URLSearchParams(location.search).get('t');
  var stored = null; try{ stored = localStorage.getItem('proto'); }catch(e){}
  var t = explicit || param || stored || '1';
  if(['1','2','3'].indexOf(t) === -1) t = '1';
  try{ localStorage.setItem('proto', t); }catch(e){}

  // Inner pages (no explicit theme) get the theme CSS + fonts injected up-front.
  if(!explicit && t !== '1'){
    var css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = 'css/theme-' + t + '.css?v=2';
    document.head.appendChild(css);
    if(FONT[t]){
      var f = document.createElement('link');
      f.rel = 'stylesheet'; f.href = FONT[t];
      document.head.appendChild(f);
    }
    root.setAttribute('data-theme', t);
  }

  // Carry the theme through internal navigation.
  function rewrite(){
    var n = t;
    document.querySelectorAll('a[href]').forEach(function(a){
      var href = a.getAttribute('href');
      if(!href) return;
      if(/^(https?:|mailto:|tel:|#)/.test(href) || href.indexOf('://') > -1) return;
      if(/^prototype-/.test(href)) return;                  // prototype links pick their own theme
      if(a.hasAttribute('data-hub')) return;                // explicit hub links stay on the hub
      // split off hash
      var hash = '', h = href;
      var hi = h.indexOf('#'); if(hi > -1){ hash = h.slice(hi); h = h.slice(0, hi); }
      // Accueil / logo -> themed homepage
      if(h === 'index.html' || h === '' || h === './'){
        a.setAttribute('href', 'prototype-' + n + '.html' + hash);
        return;
      }
      if(/\.html$/.test(h.split('?')[0])){
        var base = h.split('?')[0];
        a.setAttribute('href', base + '?t=' + n + hash);
      }
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', rewrite);
  else rewrite();
})();
