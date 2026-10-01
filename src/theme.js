export const THEME_MODES = ['light', 'dark'];
export const COLOR_THEMES = ['blue', 'indigo', 'emerald', 'violet', 'orange', 'rose'];

export function applyTheme(mode = 'light', colorTheme = 'blue') {
  const root = document.documentElement;
  root.dataset.mode = THEME_MODES.includes(mode) ? mode : 'light';
  if (colorTheme === 'blue') delete root.dataset.theme;
  else root.dataset.theme = COLOR_THEMES.includes(colorTheme) ? colorTheme : 'blue';
}

export function getStoredTheme() {
  try {
    const mode = localStorage.getItem('alum-kitchenkit-mode') || 'light';
    const colorTheme = localStorage.getItem('alum-kitchenkit-color') || 'blue';
    return { mode, colorTheme };
  } catch {
    return { mode: 'light', colorTheme: 'blue' };
  }
}

export function saveTheme(mode, colorTheme) {
  applyTheme(mode, colorTheme);
  try {
    localStorage.setItem('alum-kitchenkit-mode', mode);
    localStorage.setItem('alum-kitchenkit-color', colorTheme);
  } catch {}
}
