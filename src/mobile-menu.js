const STYLE_ID = 'ak-mobile-menu-styles';
const TRIGGER_ATTR = 'data-mobile-menu-trigger';

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @media (max-width: 767px) {
      .simplified-app > aside { display: none !important; }
      .simplified-app > main { padding-bottom: 1rem !important; }
      .simplified-app > main > header {
        padding-inline: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        gap: .75rem !important;
      }
      .ak-mobile-topbar {
        width: 100%;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: .625rem;
      }
      .ak-mobile-trigger {
        position: static;
        flex: 0 0 3.25rem;
        width: 3.25rem;
        height: 3.25rem;
        border: 1px solid var(--color-border);
        border-radius: .85rem;
        background: var(--color-surface);
        color: var(--color-text-primary);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-md);
        cursor: pointer;
      }
      .ak-mobile-trigger svg { width: 20px; height: 20px; }
      .ak-mobile-topbar .theme-switcher {
        flex: 1 1 auto;
        width: auto !important;
        min-width: 0;
        flex-wrap: nowrap;
        gap: .5rem;
      }
      .ak-mobile-topbar .theme-mode-btn,
      .ak-mobile-topbar .theme-color-select {
        flex: 1 1 0;
        min-width: 0;
        width: auto;
        padding-inline: .65rem;
        white-space: nowrap;
      }
      .ak-mobile-topbar .theme-color-select select {
        min-width: 0;
        max-width: 100%;
      }
      .ak-mobile-page-heading { min-width: 0; }
      .ak-mobile-page-heading h1,
      .ak-mobile-page-heading p { margin-inline-start: 0 !important; }
      .ak-mobile-overlay {
        position: fixed;
        inset: 0;
        z-index: 200;
        background: rgba(2, 6, 23, .52);
        opacity: 0;
        pointer-events: none;
        transition: opacity .2s ease;
      }
      .ak-mobile-overlay.open { opacity: 1; pointer-events: auto; }
      .ak-mobile-drawer {
        position: fixed;
        z-index: 210;
        inset-block: 0;
        inset-inline-start: 0;
        width: min(19rem, 86vw);
        padding: max(1rem, env(safe-area-inset-top)) 1rem max(1rem, env(safe-area-inset-bottom));
        background: var(--color-surface);
        border-inline-end: 1px solid var(--color-border);
        box-shadow: 18px 0 48px rgba(2, 6, 23, .22);
        transform: translateX(-105%);
        transition: transform .22s ease;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .ak-mobile-drawer.open { transform: translateX(0); }
      .ak-mobile-drawer[dir="rtl"] { inset-inline-start: auto; inset-inline-end: 0; transform: translateX(105%); border-inline-end: 0; border-inline-start: 1px solid var(--color-border); box-shadow: -18px 0 48px rgba(2, 6, 23, .22); }
      .ak-mobile-drawer[dir="rtl"].open { transform: translateX(0); }
      .ak-mobile-drawer-head { display:flex; align-items:center; justify-content:space-between; gap:.75rem; }
      .ak-mobile-brand { display:flex; align-items:center; gap:.75rem; min-width:0; }
      .ak-mobile-brand .logo { flex:0 0 auto; }
      .ak-mobile-brand strong,.ak-mobile-brand small { display:block; }
      .ak-mobile-brand strong { font-size:.9rem; color:var(--color-text-primary); }
      .ak-mobile-brand small { margin-top:.15rem; font-size:.7rem; color:var(--color-text-secondary); }
      .ak-mobile-close { width:2.5rem; height:2.5rem; border:1px solid var(--color-border); border-radius:.7rem; background:var(--color-surface-subtle); color:var(--color-text-primary); display:inline-flex; align-items:center; justify-content:center; cursor:pointer; }
      .ak-mobile-nav { display:grid; gap:.4rem; }
      .ak-mobile-nav button,.ak-mobile-logout { width:100%; min-height:3rem; padding:.75rem .8rem; border:1px solid transparent; border-radius:.7rem; background:transparent; color:var(--color-text-secondary); display:flex; align-items:center; gap:.75rem; text-align:start; font:inherit; cursor:pointer; }
      .ak-mobile-nav button.active { background:var(--color-primary-soft); color:var(--color-primary); border-color:color-mix(in srgb,var(--color-primary) 22%,transparent); }
      .ak-mobile-nav button svg,.ak-mobile-logout svg { flex:0 0 auto; width:19px; height:19px; }
      .ak-mobile-footer { margin-top:auto; padding-top:1rem; border-top:1px solid var(--color-border); }
      .ak-mobile-logout { color:var(--color-text-secondary); }
      .ak-mobile-logout:hover,.ak-mobile-nav button:hover { background:var(--color-surface-subtle); }
      body.ak-mobile-menu-open { overflow:hidden; }
    }
    @media (max-width: 380px) {
      .ak-mobile-topbar { gap: .45rem; }
      .ak-mobile-trigger { flex-basis: 2.9rem; width: 2.9rem; height: 2.9rem; }
      .ak-mobile-topbar .theme-mode-btn,
      .ak-mobile-topbar .theme-color-select { padding-inline: .45rem; font-size: .78rem; }
    }
    @media (min-width: 768px) {
      .ak-mobile-trigger,.ak-mobile-overlay,.ak-mobile-drawer { display:none !important; }
    }
  `;
  document.head.appendChild(style);
}

function icon(name) {
  const paths = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
  };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.innerHTML = paths[name];
  return svg;
}

function closeMenu() {
  document.querySelector('.ak-mobile-overlay')?.classList.remove('open');
  document.querySelector('.ak-mobile-drawer')?.classList.remove('open');
  document.body.classList.remove('ak-mobile-menu-open');
}

function syncActive() {
  const originalButtons = [...document.querySelectorAll('.simplified-app > aside nav button')];
  const mobileButtons = [...document.querySelectorAll('.ak-mobile-nav button')];
  mobileButtons.forEach((button, index) => {
    button.classList.toggle('active', Boolean(originalButtons[index]?.classList.contains('active')));
  });
}

function buildMenu() {
  const app = document.querySelector('.simplified-app');
  const header = app?.querySelector('main > header');
  const aside = app?.querySelector(':scope > aside');
  if (!app || !header || !aside) return;
  ensureStyles();

  let topbar = header.querySelector('.ak-mobile-topbar');
  if (!topbar) {
    topbar = document.createElement('div');
    topbar.className = 'ak-mobile-topbar';
    header.insertBefore(topbar, header.firstChild);
  }

  const heading = header.querySelector(':scope > div:not(.ak-mobile-topbar)');
  if (heading) heading.classList.add('ak-mobile-page-heading');

  let trigger = document.querySelector(`[${TRIGGER_ATTR}]`);
  if (!trigger) {
    trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'ak-mobile-trigger';
    trigger.setAttribute(TRIGGER_ATTR, 'true');
    trigger.setAttribute('aria-label', 'Ouvrir le menu');
    trigger.appendChild(icon('menu'));
    trigger.addEventListener('click', () => {
      document.querySelector('.ak-mobile-overlay')?.classList.add('open');
      document.querySelector('.ak-mobile-drawer')?.classList.add('open');
      document.body.classList.add('ak-mobile-menu-open');
    });
  }
  if (trigger.parentElement !== topbar) topbar.prepend(trigger);

  const themeSwitcher = header.querySelector('.theme-switcher');
  if (themeSwitcher && themeSwitcher.parentElement !== topbar) topbar.appendChild(themeSwitcher);

  let overlay = document.querySelector('.ak-mobile-overlay');
  let drawer = document.querySelector('.ak-mobile-drawer');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'ak-mobile-overlay';
    overlay.addEventListener('click', closeMenu);
    document.body.appendChild(overlay);
  }
  if (!drawer) {
    drawer = document.createElement('aside');
    drawer.className = 'ak-mobile-drawer';
    drawer.setAttribute('aria-label', 'Menu principal');
    const head = document.createElement('div');
    head.className = 'ak-mobile-drawer-head';
    const brand = aside.querySelector('.brand')?.cloneNode(true) || document.createElement('div');
    brand.className = 'ak-mobile-brand';
    head.appendChild(brand);
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'ak-mobile-close';
    close.setAttribute('aria-label', 'Fermer le menu');
    close.appendChild(icon('close'));
    close.addEventListener('click', closeMenu);
    head.appendChild(close);
    drawer.appendChild(head);

    const nav = document.createElement('nav');
    nav.className = 'ak-mobile-nav';
    [...aside.querySelectorAll('nav button')].forEach(original => {
      const button = original.cloneNode(true);
      button.type = 'button';
      button.addEventListener('click', () => {
        original.click();
        closeMenu();
        requestAnimationFrame(syncActive);
      });
      nav.appendChild(button);
    });
    drawer.appendChild(nav);

    const footer = document.createElement('div');
    footer.className = 'ak-mobile-footer';
    const logout = aside.querySelector('.logout')?.cloneNode(true);
    if (logout) {
      logout.className = 'ak-mobile-logout';
      logout.type = 'button';
      logout.addEventListener('click', () => {
        aside.querySelector('.logout')?.click();
        closeMenu();
      });
      footer.appendChild(logout);
    }
    drawer.appendChild(footer);
    document.body.appendChild(drawer);
  }

  drawer.setAttribute('dir', document.documentElement.dir || 'ltr');
  syncActive();
}

let scheduled = false;
function scheduleBuild() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    buildMenu();
  });
}

new MutationObserver(scheduleBuild).observe(document.body, {childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'dir']});
scheduleBuild();
