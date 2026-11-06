/* ==========================================================================
   Ô de Rose — comportements et animations
   GSAP + ScrollTrigger + Lenis (hébergés dans assets/vendor, aucun service externe)
   Règles : on n'anime que transform / opacity (sauf masques clip-path ponctuels),
   courbes douces, prefers-reduced-motion respecté.
   ========================================================================== */
(function () {
  'use strict';

  try {
    init();
  } catch (err) {
    // Sécurité : si quelque chose casse, le site reste lisible.
    console.error('[Ô de Rose]', err);
    document.documentElement.classList.remove('js');
    var l = document.getElementById('loader');
    if (l) l.remove();
    document.body.classList.remove('is-locked');
  }

  function init() {
    var $ = function (s, c) { return (c || document).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
    var INFO = window.ODR.INFO, MENU = window.ODR.MENU, REVIEWS = window.ODR.REVIEWS;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]reduce=1\b/.test(location.search);
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var isMobile = window.matchMedia('(max-width: 900px)').matches;
    var root = document.documentElement;
    if (reduce) root.classList.add('reduce');

    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out' });

    /* ---------------------------------------------------------------
       Utilitaires
       --------------------------------------------------------------- */
    function splitWords(el) {
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function (p) {
              if (!p) return;
              if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
              var w = document.createElement('span'); w.className = 'w';
              var i = document.createElement('span'); i.textContent = p;
              w.appendChild(i); frag.appendChild(w);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1) { walk(n); }
        });
      })(el);
      return $$('.w > span', el);
    }
    function splitChars(el) {
      var t = el.textContent; el.textContent = '';
      Array.prototype.forEach.call(t, function (c) {
        var o = document.createElement('span'); o.className = 'ch';
        var i = document.createElement('span'); i.textContent = c;
        o.appendChild(i); el.appendChild(o);
      });
      return $$('.ch > span', el);
    }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    /* ---------------------------------------------------------------
       Smooth scroll (Lenis)
       --------------------------------------------------------------- */
    var lenis = null;
    if (!reduce && typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.15,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true,
        wheelMultiplier: .9,
        touchMultiplier: 1.4
      });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      lenis.stop(); // verrouillé pendant le loader
    }
    function scrollToTarget(target, opts) {
      if (lenis) lenis.scrollTo(target, Object.assign({ duration: 1.7, easing: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); } }, opts || {}));
      else if (typeof target === 'number') window.scrollTo(0, target);
      else target.scrollIntoView();
    }
    function stopScroll() { document.body.classList.add('is-locked'); if (lenis) lenis.stop(); }
    function startScroll() { document.body.classList.remove('is-locked'); if (lenis) lenis.start(); }
    stopScroll();

    // ancres internes
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var h = a.getAttribute('href');
        if (h.length < 2) return;
        var t = $(h);
        if (!t) return;
        e.preventDefault();
        closeMenu(true);
        if (a.dataset.cat) setCategory(a.dataset.cat, false);
        scrollToTarget(h === '#top' ? 0 : t, { offset: h === '#top' ? 0 : -4 });
      });
    });
    $('#toTop').addEventListener('click', function () { scrollToTarget(0); });

    /* ---------------------------------------------------------------
       Horaires : ouvert / fermé (heure de Paris)
       --------------------------------------------------------------- */
    var DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    function hh(n) { var h = Math.floor(n), m = Math.round((n - h) * 60); return h + ' h' + (m ? (m < 10 ? '0' + m : m) : ''); }
    function parisNow() {
      var f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
      var p = {}; f.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: map[p.weekday], t: (parseInt(p.hour, 10) % 24) + parseInt(p.minute, 10) / 60 };
    }
    (function hoursStatus() {
      var now = parisNow(), today = INFO.hours[now.day];
      var open = !!(today && now.t >= today[0] && now.t < today[1]);
      var line = '', strong = '', small = '';
      if (open) {
        strong = 'Ouvert'; small = 'jusqu’à ' + hh(today[1]);
        line = 'Ouvert maintenant, jusqu’à ' + hh(today[1]) + (now.day === 6 ? ' (sur rendez-vous)' : '') + '.';
      } else {
        var next = null;
        for (var d = 0; d < 8 && !next; d++) {
          var di = (now.day + d) % 7, hrs = INFO.hours[di];
          if (hrs && (d > 0 || now.t < hrs[0])) next = { d: d, day: di, at: hrs[0] };
        }
        var when = next ? (next.d === 0 ? 'aujourd’hui' : next.d === 1 ? 'demain' : DAYS[next.day]) + ' à ' + hh(next.at) : '';
        strong = 'Fermé'; small = next ? 'rouvre ' + when : 'horaires';
        line = 'Fermé pour le moment' + (next ? ', réouverture ' + when + '.' : '.');
      }
      var li = $('#openNow');
      li.innerHTML = '<strong>' + strong + '</strong><span>' + small + '</span>';
      li.classList.toggle('is-open', open);
      $('#statusLine').textContent = line;
      var row = $('#hoursTable tr[data-day="' + now.day + '"]');
      if (row) row.classList.add('is-today');
    })();

    /* ---------------------------------------------------------------
       Carte des soins (onglets rendus depuis data.js)
       --------------------------------------------------------------- */
    var tabsEl = $('#carteTabs'), panelEl = $('#cartePanel');
    var currentCat = null;
    var total = MENU.reduce(function (n, c) { return n + c.items.length; }, 0);
    var statSvc = $('#statServices');
    statSvc.dataset.count = String(Math.floor(total / 10) * 10);

    MENU.forEach(function (c, i) {
      var b = document.createElement('button');
      b.className = 'tab'; b.type = 'button'; b.id = 'tab-' + c.id;
      b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'cartePanel');
      b.setAttribute('aria-selected', 'false'); b.tabIndex = -1; b.dataset.cat = c.id;
      b.innerHTML = '<span>' + esc(c.title) + '</span><span>' + c.items.length + '</span>';
      b.addEventListener('click', function () { setCategory(c.id, true); });
      b.addEventListener('keydown', function (e) {
        var k = e.key, idx = MENU.findIndex(function (x) { return x.id === currentCat; }), n = -1;
        if (k === 'ArrowDown' || k === 'ArrowRight') n = (idx + 1) % MENU.length;
        else if (k === 'ArrowUp' || k === 'ArrowLeft') n = (idx - 1 + MENU.length) % MENU.length;
        else if (k === 'Home') n = 0; else if (k === 'End') n = MENU.length - 1;
        if (n > -1) { e.preventDefault(); setCategory(MENU[n].id, true); $('#tab-' + MENU[n].id).focus(); }
      });
      tabsEl.appendChild(b);
    });

    function money(p) { return typeof p === 'number' ? p + '&nbsp;€' : '<small>' + esc(p) + '</small>'; }
    function setCategory(id, animate) {
      var cat = MENU.find(function (c) { return c.id === id; });
      if (!cat || id === currentCat) return;
      currentCat = id;
      $$('.tab', tabsEl).forEach(function (t) {
        var on = t.dataset.cat === id; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
      });
      var ipl = id === 'ipl-femme' || id === 'ipl-homme' || id === 'photo';
      var nails = id === 'mains';
      var primary = ipl
        ? '<a class="btn btn--rose" href="tel:' + INFO.phoneTel + '"><span>Appeler pour un premier rendez-vous</span></a><a class="btn btn--ghost-dark" data-planity href="' + INFO.planity + '" target="_blank" rel="noopener"><span>Séances suivantes en ligne</span></a>'
        : '<a class="btn btn--rose" data-planity href="' + INFO.planity + '" target="_blank" rel="noopener"><span>Réserver en ligne</span></a><a class="btn btn--ghost-dark" href="tel:' + INFO.phoneTel + '"><span>' + (nails ? 'Ongles : appeler Aurore' : 'Poser une question') + '</span></a>';
      var rows = cat.items.map(function (it) {
        return '<li class="row"><div class="row__name"><span>' + esc(it[0]) + '</span><i class="row__dots" aria-hidden="true"></i></div>' +
          '<div class="row__meta"><span class="row__dur">' + esc(it[1]) + '</span><span class="row__price">' + money(it[2]) + '</span></div>' +
          (it[3] ? '<p class="row__note">' + esc(it[3]) + '</p>' : '') + '</li>';
      }).join('');
      panelEl.setAttribute('aria-labelledby', 'tab-' + id);
      panelEl.innerHTML =
        '<div class="panel__head"><p class="panel__kicker">' + esc(cat.kicker) + '</p><h3 class="panel__title">' + esc(cat.title) + '</h3><p class="panel__intro">' + esc(cat.intro) + '</p><div class="panel__cta">' + primary + '</div></div><ul class="rows">' + rows + '</ul>';
      if (animate && !reduce) {
        gsap.from(panelEl.querySelectorAll('.panel__head > *'), { y: 24, opacity: 0, duration: .8, stagger: .07, clearProps: 'all' });
        gsap.from(panelEl.querySelectorAll('.row'), { y: 18, opacity: 0, duration: .7, stagger: { each: .025, amount: .6 }, delay: .15, clearProps: 'all' });
      }
      ScrollTrigger.refresh();
    }
    setCategory('headspa', false);

    /* ---------------------------------------------------------------
       Avis (carrousel)
       --------------------------------------------------------------- */
    var STAR = '<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="m10 1.5 2.5 5.6 6 .6-4.5 4 1.3 6-5.3-3.1L4.7 17.7 6 11.7l-4.5-4 6-.6z"/></svg>';
    var revTrack = $('#revTrack');
    revTrack.innerHTML = REVIEWS.map(function (r) {
      return '<article class="rcard"><div class="rcard__stars" role="img" aria-label="Note : 5 sur 5">' + STAR + STAR + STAR + STAR + STAR + '</div>' +
        '<blockquote>« ' + esc(r.t) + ' »</blockquote><footer><b>' + esc(r.a) + '</b><span>' + esc(r.s) + '</span><span>' + esc(r.d) + '</span></footer></article>';
    }).join('');
    var vp = $('#revViewport'), bar = $('#revBar');
    function barUpdate() {
      var max = vp.scrollWidth - vp.clientWidth;
      var ratio = (vp.clientWidth + vp.scrollLeft) / vp.scrollWidth;
      bar.style.transform = 'scaleX(' + Math.max(.08, Math.min(1, ratio)).toFixed(3) + ')';
      return max;
    }
    vp.addEventListener('scroll', barUpdate, { passive: true });
    function revStep(dir) {
      var card = $('.rcard', revTrack), w = card.getBoundingClientRect().width + 24;
      var max = vp.scrollWidth - vp.clientWidth;
      if (dir > 0 && vp.scrollLeft >= max - 4) vp.scrollTo({ left: 0, behavior: 'smooth' });
      else vp.scrollBy({ left: dir * w, behavior: 'smooth' });
    }
    var autoplay = !reduce, autoTimer = null, revVisible = false;
    function stopAuto() { autoplay = false; clearInterval(autoTimer); }
    $('#revPrev').addEventListener('click', function () { stopAuto(); revStep(-1); });
    $('#revNext').addEventListener('click', function () { stopAuto(); revStep(1); });
    vp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { stopAuto(); revStep(1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { stopAuto(); revStep(-1); e.preventDefault(); }
    });
    // glisser à la souris
    (function drag() {
      var down = false, sx = 0, sl = 0;
      vp.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = vp.scrollLeft; vp.classList.add('is-drag'); stopAuto(); });
      window.addEventListener('pointermove', function (e) { if (!down) return; vp.scrollLeft = sl - (e.clientX - sx); });
      window.addEventListener('pointerup', function () { if (!down) return; down = false; vp.classList.remove('is-drag'); });
    })();
    vp.addEventListener('wheel', stopAuto, { passive: true });
    vp.addEventListener('touchstart', stopAuto, { passive: true });
    autoTimer = setInterval(function () { if (autoplay && revVisible && document.visibilityState === 'visible') revStep(1); }, 5200);
    barUpdate();

    /* ---------------------------------------------------------------
       Formulaire SMS pré-rempli (aucun back-end)
       --------------------------------------------------------------- */
    var sel = $('#smsSoin'), name = $('#smsName'), note = $('#smsNote'), smsForm = $('#smsForm');
    function checkedVal(n) { var r = $('input[name="' + n + '"]:checked', smsForm); return r ? r.value : ''; }

    // jours proposés : les 10 prochains jours d'ouverture (mercredi et dimanche exclus)
    (function days() {
      var now = parisNow(), base = new Date(), added = 0;
      var out = ['<label class="chip"><input type="radio" name="day" value="" checked><span>Peu importe</span></label>'];
      for (var d = 0; d < 21 && added < 10; d++) {
        var dt = new Date(base.getFullYear(), base.getMonth(), base.getDate() + d, 12);
        var hrs = INFO.hours[dt.getDay()];
        if (!hrs) continue;
        if (d === 0 && now.t >= hrs[1] - .5) continue;
        var long = dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
        var short = d === 0 ? 'Aujourd’hui' : d === 1 ? 'Demain' : dt.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
        out.push('<label class="chip"><input type="radio" name="day" value="' + esc(long) + '"><span>' + esc(short) + '</span></label>');
        added++;
      }
      $('#smsDays').innerHTML = out.join('');
    })();

    // sélecteur de soin sur mesure (catégories + recherche), à la place du <select> natif
    (function picker() {
      var root = $('#pick'), btn = $('#pickBtn'), panel = $('#pickPanel'), val = $('#pickValue');
      var cats = $('#pickCats'), search = $('#pickSearch'), list = $('#pickList');
      var NONE = 'Je ne sais pas encore, conseillez-moi';
      var cat = 'all', q = '', active = -1, opts = [];
      var norm = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };

      cats.innerHTML = '<button type="button" class="pchip is-on" data-c="all">Tous</button>' + MENU.map(function (c) {
        return '<button type="button" class="pchip" data-c="' + c.id + '">' + esc(c.title) + '</button>';
      }).join('');

      function render() {
        var html = '';
        if (cat === 'all' && !q) html += '<li class="pick__opt pick__opt--none" role="option" data-v="" data-short="">' + NONE + '</li>';
        MENU.forEach(function (c) {
          if (cat !== 'all' && c.id !== cat) return;
          var items = c.items.filter(function (it) { return !q || norm(c.title + ' ' + it[0] + ' ' + it[3]).indexOf(q) > -1; });
          if (!items.length) return;
          html += '<li class="pick__group" role="presentation">' + esc(c.title) + '</li>';
          items.forEach(function (it) {
            var num = typeof it[2] === 'number', price = num ? it[2] + ' €' : it[2];
            var full = c.title + ' · ' + it[0] + (num ? ' (' + it[2] + ' €)' : '');
            html += '<li class="pick__opt" role="option" data-v="' + esc(full) + '" data-short="' + esc(it[0] + (num ? ' · ' + it[2] + ' €' : '')) + '">' +
              '<span class="pick__name">' + esc(it[0]) + '</span><span class="pick__meta"><i>' + esc(it[1]) + '</i><b>' + esc(price) + '</b></span></li>';
          });
        });
        if (!html) html = '<li class="pick__empty" role="presentation">Aucun soin ne correspond. Décrivez-le dans la précision, on s’en occupe.</li>';
        list.innerHTML = html;
        opts = $$('.pick__opt', list);
        opts.forEach(function (o, i) { o.id = 'po-' + i; o.setAttribute('aria-selected', o.dataset.v === sel.value ? 'true' : 'false'); });
        active = -1; search.removeAttribute('aria-activedescendant');
      }
      function setActive(i) {
        if (!opts.length) return;
        active = (i + opts.length) % opts.length;
        opts.forEach(function (o, k) { o.classList.toggle('is-active', k === active); });
        search.setAttribute('aria-activedescendant', opts[active].id);
        opts[active].scrollIntoView({ block: 'nearest' });
      }
      function open() {
        panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); root.classList.add('is-open');
        search.value = ''; q = '';
        render();
        var cur = $('.pick__opt[aria-selected="true"]', list);
        if (cur && cur.dataset.v) { cur.scrollIntoView({ block: 'center' }); }
        if (!reduce) gsap.fromTo(panel, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'expo.out', clearProps: 'transform' });
        if (finePointer) search.focus({ preventScroll: true });
        setTimeout(function () { panel.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); }, 60);
      }
      function close(refocus) {
        if (panel.hidden) return;
        panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); root.classList.remove('is-open');
        if (refocus) btn.focus({ preventScroll: true });
      }
      function choose(o) {
        sel.value = o.dataset.v;
        val.textContent = o.dataset.v ? o.dataset.short : NONE;
        root.classList.toggle('has-val', !!o.dataset.v);
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        close(true);
      }
      btn.addEventListener('click', function () { panel.hidden ? open() : close(false); });
      btn.addEventListener('keydown', function (e) { if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && panel.hidden) { e.preventDefault(); open(); } });
      cats.addEventListener('click', function (e) {
        var b = e.target.closest('.pchip'); if (!b) return;
        cat = b.dataset.c;
        $$('.pchip', cats).forEach(function (x) { x.classList.toggle('is-on', x === b); });
        render(); list.scrollTop = 0;
      });
      search.addEventListener('input', function () { q = norm(search.value.trim()); render(); list.scrollTop = 0; });
      panel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active < 0 ? opts.length - 1 : active - 1); }
        else if (e.key === 'Enter' && active > -1 && e.target === search) { e.preventDefault(); choose(opts[active]); }
        else if (e.key === 'Escape') { e.stopPropagation(); close(true); }
      });
      list.addEventListener('click', function (e) { var o = e.target.closest('.pick__opt'); if (o) choose(o); });
      list.addEventListener('pointermove', function (e) { var o = e.target.closest('.pick__opt'); if (o) { var i = opts.indexOf(o); if (i !== active) { active = i; opts.forEach(function (x, k) { x.classList.toggle('is-active', k === i); }); } } });
      document.addEventListener('pointerdown', function (e) { if (!root.contains(e.target)) close(false); });
      render();
    })();
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    function smsText() {
      var l = ['Bonjour, je souhaite prendre rendez-vous chez Ô de Rose.'];
      l.push('Soin : ' + (sel.value || 'je ne sais pas encore, pouvez-vous me conseiller ?'));
      var dv = checkedVal('day'), mv = checkedVal('moment');
      if (dv) l.push('Jour souhaité : ' + dv + (mv ? ' (' + mv.toLowerCase() + ')' : ''));
      else if (mv) l.push('Moment souhaité : ' + mv.toLowerCase());
      else l.push('Je suis flexible sur le jour et le moment.');
      if (note.value.trim()) l.push('Précision : ' + note.value.trim());
      l.push('Merci' + (name.value.trim() ? ', ' + name.value.trim() : '') + ' !');
      return l.join('\n');
    }
    function smsUpdate() {
      var t = smsText();
      $('#smsPreview').textContent = t;
      $('#smsSend').setAttribute('href', 'sms:' + INFO.phoneTel + (iOS ? '&' : '?') + 'body=' + encodeURIComponent(t));
    }
    ['input', 'change'].forEach(function (ev) { $('#smsForm').addEventListener(ev, smsUpdate); });
    smsUpdate();
    function copyText(t, btn) {
      var label = btn.querySelector('span'), old = label.textContent;
      var done = function () { label.textContent = 'Message copié ✓'; setTimeout(function () { label.textContent = old; }, 2200); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () {});
      else { var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) {} ta.remove(); }
    }
    $('#smsCopy').addEventListener('click', function () { copyText(smsText(), this); });
    $('#smsSend').addEventListener('click', function () { if (!iOS && !/Android/.test(navigator.userAgent)) copyText(smsText(), $('#smsCopy')); });
    $('#smsForm').addEventListener('submit', function (e) { e.preventDefault(); });

    /* ---------------------------------------------------------------
       Mentions légales + lightbox
       --------------------------------------------------------------- */
    var legal = $('#legal');
    $('#legalBtn').addEventListener('click', function () { legal.showModal(); });
    legal.addEventListener('click', function (e) { if (e.target === legal) legal.close(); });

    var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
    var gItems = $$('.gitem'), lbIdx = 0;
    function lbShow(i) {
      lbIdx = (i + gItems.length) % gItems.length;
      var it = gItems[lbIdx];
      lbImg.src = it.dataset.lb; lbImg.alt = $('img', it).alt; lbCap.textContent = it.dataset.cap || '';
    }
    gItems.forEach(function (it, i) { it.addEventListener('click', function () { lbShow(i); lb.showModal(); stopScroll(); }); });
    $('#lbClose').addEventListener('click', function () { lb.close(); });
    $('#lbPrev').addEventListener('click', function () { lbShow(lbIdx - 1); });
    $('#lbNext').addEventListener('click', function () { lbShow(lbIdx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', startScroll);
    lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') lbShow(lbIdx - 1); if (e.key === 'ArrowRight') lbShow(lbIdx + 1); });

    /* ---------------------------------------------------------------
       Menu mobile plein écran
       --------------------------------------------------------------- */
    var burger = $('#burger'), menu = $('#menu'), menuOpen = false;
    function openMenu() {
      if (menuOpen) return; menuOpen = true;
      document.body.classList.add('menu-open'); stopScroll();
      burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Fermer le menu');
      menu.removeAttribute('inert'); menu.setAttribute('aria-hidden', 'false'); menu.style.visibility = 'visible';
      gsap.killTweensOf(menu);
      gsap.fromTo(menu, { clipPath: 'circle(0px at calc(100% - 2.2rem) 2.4rem)' }, { clipPath: 'circle(160vmax at calc(100% - 2.2rem) 2.4rem)', duration: reduce ? .01 : 1.1, ease: 'expo.inOut' });
      if (!reduce) gsap.fromTo($$('.menu__nav a, .menu__foot > *'), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, stagger: .06, delay: .35 });
    }
    function closeMenu(immediate) {
      if (!menuOpen) return; menuOpen = false;
      document.body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Ouvrir le menu');
      menu.setAttribute('inert', ''); menu.setAttribute('aria-hidden', 'true');
      gsap.killTweensOf(menu);
      gsap.to(menu, { clipPath: 'circle(0px at calc(100% - 2.2rem) 2.4rem)', duration: immediate || reduce ? .01 : .8, ease: 'expo.inOut', onComplete: function () { menu.style.visibility = 'hidden'; } });
      startScroll();
    }
    burger.addEventListener('click', function () { menuOpen ? closeMenu() : openMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1100) closeMenu(true); });

    /* ---------------------------------------------------------------
       Navigation : se cache en descendant, revient en remontant
       --------------------------------------------------------------- */
    var nav = $('#nav');
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: function (self) {
        var y = self.scroll();
        nav.classList.toggle('is-solid', y > 80);
        if (menuOpen) return;
        if (self.direction === 1 && y > 420) gsap.to(nav, { yPercent: -100, duration: .6, ease: 'power3.out', overwrite: true });
        else if (self.direction === -1 || y < 420) gsap.to(nav, { yPercent: 0, duration: .6, ease: 'power3.out', overwrite: true });
      }
    });
    if (!reduce) gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } });
    else $('#progress').style.display = 'none';

    /* ---------------------------------------------------------------
       Curseur anneau + boutons magnétiques + tilt
       --------------------------------------------------------------- */
    if (finePointer && !reduce) {
      var cur = $('#cursor'), curLabel = $('#cursorLabel');
      var cx = gsap.quickTo(cur, 'x', { duration: .45, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: .45, ease: 'power3' });
      var shown = false;
      window.addEventListener('pointermove', function (e) {
        if (!shown) { shown = true; gsap.set(cur, { x: e.clientX, y: e.clientY }); gsap.to(cur, { opacity: 1, duration: .4 }); }
        cx(e.clientX); cy(e.clientY);
      });
      document.addEventListener('pointerover', function (e) {
        var t = e.target.closest ? e.target.closest('a, button, summary, input, select, textarea, .gitem, .card') : null;
        var view = t && (t.classList.contains('gitem') || t.classList.contains('card'));
        cur.classList.toggle('is-link', !!t && !view);
        cur.classList.toggle('is-view', !!view);
        curLabel.textContent = view ? (t.classList.contains('gitem') ? 'Voir' : 'Tarifs') : '';
        gsap.to(cur, { scale: view ? 1.9 : t ? 1.5 : 1, duration: .45 });
      });
      document.addEventListener('pointerleave', function () { gsap.to(cur, { opacity: 0 }); shown = false; });

      $$('.magnetic').forEach(function (b) {
        var inner = b.querySelector('span');
        var bx = gsap.quickTo(b, 'x', { duration: .6, ease: 'power3' }), by = gsap.quickTo(b, 'y', { duration: .6, ease: 'power3' });
        var ix = inner ? gsap.quickTo(inner, 'x', { duration: .6, ease: 'power3' }) : null, iy = inner ? gsap.quickTo(inner, 'y', { duration: .6, ease: 'power3' }) : null;
        b.addEventListener('pointermove', function (e) {
          var r = b.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
          bx(dx * .28); by(dy * .4); if (ix) { ix(dx * .12); iy(dy * .2); }
        });
        b.addEventListener('pointerleave', function () { bx(0); by(0); if (ix) { ix(0); iy(0); } });
      });

      var tilt = function (el, max) {
        gsap.set(el, { transformPerspective: 900 });
        var rx = gsap.quickTo(el, 'rotationX', { duration: .6, ease: 'power3' }), ry = gsap.quickTo(el, 'rotationY', { duration: .6, ease: 'power3' });
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          ry((px - .5) * 2 * max); rx(-(py - .5) * 2 * max);
          el.style.setProperty('--gx', (px * 100).toFixed(1) + '%'); el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
        });
        el.addEventListener('pointerleave', function () { rx(0); ry(0); });
      };
      $$('.tilt').forEach(function (el) { tilt(el, 9); });
      $$('.gitem').forEach(function (el) { tilt(el, 5); });
    }

    /* ---------------------------------------------------------------
       Hero : texte, pétales, vidéo
       --------------------------------------------------------------- */
    var heroVideo = $('#heroVideo');
    var videoReady = new Promise(function (res) {
      var done = false; var fin = function () { if (done) return; done = true; heroVideo.classList.add('is-ready'); res(); };
      heroVideo.addEventListener('loadeddata', fin); heroVideo.addEventListener('canplay', fin);
      if (heroVideo.readyState >= 2) fin();
      setTimeout(fin, 3800);
      var p = heroVideo.play(); if (p && p.catch) p.catch(function () {});
      if (reduce) heroVideo.addEventListener('loadeddata', function () { heroVideo.pause(); });
    });

    var heroChars = $$('[data-chars]', $('.hero__title')).reduce(function (a, el) { return a.concat(splitChars(el)); }, []);
    var heroFades = $$('[data-hero="fade"]');
    if (!reduce) {
      gsap.set(heroChars, { yPercent: 125, rotate: 6 });
      gsap.set(heroFades, { y: 34, opacity: 0 });
      gsap.set('.hero__ring', { scale: .55, opacity: 0 });
    }

    // pétales : une couche de profondeur, un mouvement ambiant
    var petalsBox = $('#petals'), PETAL_COLORS = ['#EBD3CA', '#E3B5AD', '#C98480', '#F2DDD5', '#D99E98'];
    var petalCount = reduce ? 6 : isMobile ? 7 : 15, petals = [];
    for (var i = 0; i < petalCount; i++) {
      var depth = gsap.utils.random(.2, 1), size = gsap.utils.random(16, 54) * (.6 + depth * .7);
      var wrap = document.createElement('div'); wrap.className = 'petal';
      wrap.style.cssText = 'left:' + gsap.utils.random(2, 96).toFixed(1) + '%;top:' + gsap.utils.random(4, 92).toFixed(1) + '%;width:' + size.toFixed(0) + 'px;height:' + (size * 1.5).toFixed(0) + 'px;opacity:' + (.35 + depth * .5).toFixed(2) + ';color:' + PETAL_COLORS[i % PETAL_COLORS.length] + ';filter:blur(' + (depth < .35 ? 2.2 : 0) + 'px) drop-shadow(0 6px 10px rgba(42,29,27,.25))';
      var inner = document.createElement('span'); inner.style.cssText = 'display:block;width:100%;height:100%';
      inner.innerHTML = '<svg viewBox="0 0 60 90" aria-hidden="true"><use href="#petal"/></svg>';
      wrap.appendChild(inner); petalsBox.appendChild(wrap);
      gsap.set(inner, { rotation: gsap.utils.random(-70, 70) });
      petals.push({ wrap: wrap, inner: inner, depth: depth });
      if (!reduce) gsap.to(inner, { y: gsap.utils.random(40, 110), x: gsap.utils.random(-50, 50), rotation: '+=' + gsap.utils.random(-80, 80), duration: gsap.utils.random(6, 12), yoyo: true, repeat: -1, ease: 'sine.inOut', delay: -gsap.utils.random(0, 8) });
    }

    // parallax multicouche au scroll
    if (!reduce) {
      var htl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      htl.to('#heroMedia', { yPercent: isMobile ? 9 : 16, scale: isMobile ? 1.06 : 1.16 }, 0)
         .to('.hero__inner', { yPercent: -14 }, 0)
         .to('.hero__inner', { opacity: 0, ease: 'power1.in', duration: .55 }, .35)
         .to('.hero__scroll', { opacity: 0, duration: .25 }, 0);
      petals.forEach(function (p) { htl.to(p.wrap, { y: -p.depth * (isMobile ? 160 : 340) }, 0); });
    }

    /* ---------------------------------------------------------------
       Titres : mot par mot (masque qui monte)
       --------------------------------------------------------------- */
    $$('[data-split]').forEach(function (el) {
      var words = splitWords(el);
      el.style.visibility = 'visible';
      if (reduce) return;
      gsap.set(words, { yPercent: 118, rotate: 4 });
      ScrollTrigger.create({
        trigger: el, start: 'top 86%', once: true,
        onEnter: function () { gsap.to(words, { yPercent: 0, rotate: 0, duration: 1.25, ease: 'expo.out', stagger: .055 }); }
      });
    });

    /* ---------------------------------------------------------------
       Marquee réactif au scroll
       --------------------------------------------------------------- */
    if (!reduce) {
      var mq = [];
      $$('.marquee__row').forEach(function (row, i) {
        var track = $('.marquee__track', row), clone = track.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true'); row.appendChild(clone);
        var dir = parseInt(row.dataset.dir, 10);
        var tw = gsap.fromTo([track, clone], { xPercent: dir < 0 ? 0 : -100 }, { xPercent: dir < 0 ? -100 : 0, duration: 42 + i * 10, ease: 'none', repeat: -1 });
        mq.push(tw);
      });
      var boost = 0;
      if (lenis) lenis.on('scroll', function (e) { boost = Math.max(boost, Math.min(Math.abs(e.velocity) * .45, 7)); });
      gsap.ticker.add(function () { boost *= .93; var s = 1 + boost; mq.forEach(function (tw) { tw.timeScale(s); }); });
    }

    /* ---------------------------------------------------------------
       Le lieu : section pinnée, 4 étapes
       --------------------------------------------------------------- */
    (function story() {
      var steps = $$('.step'), imgs = $$('.story__img'), dots = $$('.story__dots i');
      var ring = $('#storyRing'), numEl = $('#storyNum'), idxEl = $('#storyIdx');
      if (reduce) { imgs.forEach(function (im, i) { im.classList.toggle('is-active', i === 0); }); return; }
      steps.forEach(function (s, i) { s.classList.remove('is-active'); gsap.set(s, { autoAlpha: i === 0 ? 1 : 0, y: 0 }); });
      imgs.forEach(function (im, i) {
        im.classList.remove('is-active');
        gsap.set(im, { clipPath: i === 0 ? 'circle(75% at 50% 50%)' : 'circle(0% at 50% 50%)', zIndex: i === 0 ? 2 : 0 });
        gsap.set($('img', im), { scale: 1.12 });
      });
      var title0 = $$('.step__title .w', steps[0]);
      var curStep = 0;
      function go(n) {
        if (n === curStep) return;
        var prev = curStep; curStep = n;
        gsap.to(steps[prev], { autoAlpha: 0, y: -30, duration: .45, ease: 'power2.in', overwrite: 'auto' });
        gsap.fromTo(steps[n], { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, duration: .95, delay: .25, ease: 'expo.out', overwrite: 'auto' });
        var words = $$('.step__title .w > span', steps[n]);
        if (words.length) gsap.fromTo(words, { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: .07, delay: .3, ease: 'expo.out' });
        imgs.forEach(function (im, i) { gsap.set(im, { zIndex: i === n ? 3 : i === prev ? 2 : 0 }); });
        gsap.killTweensOf(imgs[n]);
        gsap.fromTo(imgs[n], { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1.35, ease: 'expo.inOut', onComplete: function () { imgs.forEach(function (im, i) { if (i !== curStep) gsap.set(im, { clipPath: 'circle(0% at 50% 50%)', zIndex: 0 }); }); } });
        gsap.fromTo($('img', imgs[n]), { scale: 1.4 }, { scale: 1.12, duration: 1.8, ease: 'expo.out' });
        dots.forEach(function (d, i) { d.classList.toggle('is-on', i === n); });
        var label = ('0' + (n + 1)).slice(-2);
        idxEl.textContent = label;
        gsap.fromTo(numEl, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, onStart: function () { numEl.textContent = label; } });
      }
      var len = isMobile ? 260 : 380;
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '#storyPin', start: 'top top', end: '+=' + len + '%', pin: true, scrub: .5, anticipatePin: 1,
          onUpdate: function (self) { go(Math.min(3, Math.floor(self.progress * 4 + .0001))); }
        }
      }).to(ring, { strokeDashoffset: 0 }, 0);
    })();

    /* ---------------------------------------------------------------
       Nos soins : défilement horizontal piloté par le scroll vertical
       --------------------------------------------------------------- */
    var mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', function () {
      var track = $('#uniTrack');
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: '#uniPin', start: 'top top', end: function () { return '+=' + (dist() * 1.05); }, pin: true, scrub: .8, invalidateOnRefresh: true, anticipatePin: 1 }
      });
      $$('.card__img img').forEach(function (img) {
        gsap.fromTo(img, { xPercent: 9 }, { xPercent: -9, ease: 'none', scrollTrigger: { trigger: '#uniPin', start: 'top top', end: function () { return '+=' + (dist() * 1.05); }, scrub: true, invalidateOnRefresh: true } });
      });
    });
    if (!reduce) {
      gsap.from('.card', { y: 60, opacity: 0, duration: 1.1, stagger: .09, ease: 'expo.out', scrollTrigger: { trigger: '#uniPin', start: 'top 75%', once: true } });
    }

    /* ---------------------------------------------------------------
       Head Spa : le cercle de vidéo qui s'agrandit
       --------------------------------------------------------------- */
    (function headSpa() {
      var stage = $('#hsStage'), vwrap = $('#hsVideo'), vid = $('#hsVid');
      ScrollTrigger.create({
        trigger: stage, start: 'top bottom', end: 'bottom top',
        onEnter: function () { var p = vid.play(); if (p && p.catch) p.catch(function () {}); },
        onEnterBack: function () { var p = vid.play(); if (p && p.catch) p.catch(function () {}); },
        onLeave: function () { vid.pause(); }, onLeaveBack: function () { vid.pause(); }
      });
      if (reduce) { vid.addEventListener('loadeddata', function () { vid.pause(); }); return; }
      var r0 = function () { return Math.min(window.innerWidth, window.innerHeight) * (isMobile ? .2 : .17); };
      var r1 = function () { return Math.hypot(window.innerWidth, window.innerHeight) / 2 + 30; };
      var tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: stage, start: 'top top', end: '+=' + (isMobile ? 130 : 170) + '%', pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1 }
      });
      tl.fromTo(vwrap, { '--r': function () { return r0() + 'px'; } }, { '--r': function () { return r1() + 'px'; }, duration: 1 }, 0)
        .fromTo(vid, { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
        .fromTo('#hsCopy .hs__lead', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .35 }, .55)
        .to('#hsCopy .title', { y: -26, duration: 1 }, 0);
    })();

    // les anneaux des formules se dessinent
    $$('.hcard').forEach(function (card, i) {
      var arc = $('.hcard__arc', card);
      var target = parseFloat(arc.getAttribute('stroke-dashoffset'));
      if (reduce) return;
      gsap.set(arc, { strokeDashoffset: 100 });
      gsap.from(card, { y: 70, opacity: 0, duration: 1.2, delay: i * .1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
      gsap.to(arc, { strokeDashoffset: target, duration: 2, delay: .3 + i * .1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
    });

    /* ---------------------------------------------------------------
       Chiffres clés : compteurs + anneaux
       --------------------------------------------------------------- */
    var ARC = [0, 0, 24, 14];
    $$('.stat').forEach(function (stat, i) {
      var num = $('[data-count]', stat), arc = $('.stat__arc', stat);
      var target = parseFloat(num.dataset.count), dec = parseInt(num.dataset.dec || '0', 10);
      var fmt = function (v) { return v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec }); };
      if (i === 3) { var sm = $('small', stat); if (sm) sm.textContent = '+'; }
      if (reduce) { num.textContent = fmt(target); arc.style.strokeDashoffset = ARC[i]; return; }
      ScrollTrigger.create({
        trigger: stat, start: 'top 85%', once: true,
        onEnter: function () {
          var o = { v: 0 };
          gsap.to(o, { v: target, duration: 2.4, ease: 'power3.out', onUpdate: function () { num.textContent = fmt(o.v); } });
          gsap.to(arc, { strokeDashoffset: ARC[i], duration: 2.4, ease: 'expo.out' });
        }
      });
    });

    /* ---------------------------------------------------------------
       Galerie : révélations alternées + image qui bouge dans son cadre
       --------------------------------------------------------------- */
    $$('.gitem').forEach(function (it, i) {
      var inner = $('.gitem__in', it);
      if (reduce) return;
      var circle = i % 3 === 0;
      gsap.fromTo(it,
        { clipPath: circle ? 'circle(0% at 50% 50%)' : 'inset(100% 0% 0% 0% round 22px)' },
        { clipPath: circle ? 'circle(100% at 50% 50%)' : 'inset(0% 0% 0% 0% round 22px)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath',
          scrollTrigger: { trigger: it, start: 'top 90%', once: true } });
      gsap.fromTo(inner, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: it, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* ---------------------------------------------------------------
       Avis : apparition + barres de notes
       --------------------------------------------------------------- */
    ScrollTrigger.create({ trigger: '#revViewport', start: 'top bottom', end: 'bottom top', onToggle: function (s) { revVisible = s.isActive; } });
    if (!reduce) {
      gsap.from('.rcard', { x: 120, opacity: 0, duration: 1.2, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '#revViewport', start: 'top 85%', once: true } });
      $$('.criteria i').forEach(function (b, i) {
        gsap.fromTo(b, { '--s': 0 }, { '--s': 1, duration: 1.6, delay: i * .12, ease: 'expo.out', scrollTrigger: { trigger: '.criteria', start: 'top 88%', once: true } });
      });
    } else { $$('.criteria i').forEach(function (b) { b.style.setProperty('--s', 1); }); }

    /* ---------------------------------------------------------------
       Réserver, FAQ, footer
       --------------------------------------------------------------- */
    if (!reduce) {
      gsap.from('.book__lead, .book__actions, .sms, .mini', { y: 50, opacity: 0, duration: 1.1, stagger: .09, ease: 'expo.out', scrollTrigger: { trigger: '.book__inner', start: 'top 70%', once: true } });
      gsap.from('.faq details', { y: 30, opacity: 0, duration: .9, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: '.faq__list', start: 'top 85%', once: true } });
      gsap.from('.find__map', { clipPath: 'inset(8% 8% 8% 8% round 999px 999px 28px 28px)', opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.find__map', start: 'top 85%', once: true } });
    }
    var fchars = $$('[data-chars]', $('#footGiant')).reduce(function (a, el) { return a.concat(splitChars(el)); }, []);
    if (!reduce) {
      gsap.set(fchars, { yPercent: 110 });
      ScrollTrigger.create({ trigger: '#footGiant', start: 'top 95%', once: true, onEnter: function () { gsap.to(fchars, { yPercent: 0, duration: 1.5, stagger: .1, ease: 'expo.out' }); } });
    }

    /* ---------------------------------------------------------------
       Loader → entrée spectaculaire
       --------------------------------------------------------------- */
    var loader = $('#loader'), loaderNum = $('#loaderNum'), loaderDraw = $('.loader__draw');
    function heroIntro() {
      if (reduce) return;
      var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.to('.hero__ring', { scale: 1, opacity: 1, duration: 2.2 }, 0)
        .to(heroChars, { yPercent: 0, rotate: 0, duration: 1.6, stagger: .07, ease: 'power4.out' }, .1)
        .to(heroFades, { y: 0, opacity: 1, duration: 1.2, stagger: .12 }, .55);
      gsap.from('#heroMedia', { scale: 1.25, duration: 3, ease: 'expo.out' });
    }
    function reveal() {
      if (reduce) {
        gsap.to(loader, { opacity: 0, duration: .5, onComplete: function () { loader.remove(); } });
        startScroll(); ScrollTrigger.refresh(); return;
      }
      var end = Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) / 2) + 60;
      gsap.timeline({ onComplete: function () { loader.remove(); ScrollTrigger.refresh(); } })
        .to('.loader__center, .loader__word, .loader__count', { scale: 1.08, duration: .5, ease: 'power2.in' }, 0)
        .to(loader, { '--r': end + 'px', duration: 1.7, ease: 'expo.inOut' }, .25)
        .add(function () { startScroll(); heroIntro(); }, .85);
    }
    var prog = { v: 0 }, minDone = false, ready = false;
    var fontsReady = (document.fonts && document.fonts.ready) ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 2500); })]) : Promise.resolve();
    Promise.all([fontsReady, videoReady]).then(function () { ready = true; check(); });
    gsap.to(prog, { v: 88, duration: reduce ? .4 : 1.9, ease: 'power2.out', onUpdate: paint, onComplete: function () { minDone = true; check(); } });
    function paint() { loaderNum.textContent = Math.round(prog.v); loaderDraw.style.strokeDashoffset = 100 - prog.v; }
    var finished = false;
    function check() {
      if (finished || !(ready && minDone)) return; finished = true;
      gsap.to(prog, { v: 100, duration: .5, ease: 'power1.out', onUpdate: paint, onComplete: reveal });
    }
    // filet de sécurité : jamais plus de 7 s sur le loader
    setTimeout(function () { if (!finished) { finished = true; prog.v = 100; paint(); reveal(); } }, 7000);

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();
