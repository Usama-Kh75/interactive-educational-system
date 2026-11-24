// =========================================================================
// وحدة المظهر والوضع الليلي المحسّن (Enhanced Dark Mode & Media Comfort)
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

window.ThemeManager = (() => {
  const THEME_MODE_KEY = 'theme_mode';
  const DARK_DIM_MEDIA_KEY = 'dark_dim_media';
  const VALID_MODES = ['light', 'dark', 'auto'];
  const MODE_LABELS = {
    light: 'الوضع النهاري الفاتح',
    dark: 'الوضع الليلي المريح للعين',
    auto: 'الوضع التلقائي حسب النظام'
  };

  let initialized = false;
  let mediaQueryList = null;

  function getMode() {
    const stored = (typeof lsGet === 'function') ? lsGet(THEME_MODE_KEY) : localStorage.getItem('interactive_edu_' + THEME_MODE_KEY);
    return VALID_MODES.includes(stored) ? stored : 'light';
  }

  function getSystemPrefersDark() {
    return Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function getEffectiveTheme(mode = getMode()) {
    if (mode === 'auto') {
      return getSystemPrefersDark() ? 'dark' : 'light';
    }
    return mode === 'dark' ? 'dark' : 'light';
  }

  function isDark() {
    return getEffectiveTheme() === 'dark';
  }

  function getDarkDimMedia() {
    const raw = (typeof lsGet === 'function') ? lsGet(DARK_DIM_MEDIA_KEY) : localStorage.getItem('interactive_edu_' + DARK_DIM_MEDIA_KEY);
    return raw !== 'false';
  }

  function updateMetaThemeColor(effectiveTheme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', effectiveTheme === 'dark' ? '#0f172a' : '#4338ca');
    }
  }

  function syncThemeUI(mode, effective, dimMedia) {
    const isDarkNow = effective === 'dark';

    const headerBtn = document.getElementById('headerThemeToggleBtn');
    if (headerBtn) {
      headerBtn.setAttribute('aria-pressed', isDarkNow ? 'true' : 'false');
      headerBtn.setAttribute('title', isDarkNow ? 'التبديل إلى الوضع النهاري (Alt+Shift+D)' : 'التبديل إلى الوضع الليلي (Alt+Shift+D)');
      headerBtn.setAttribute('aria-label', isDarkNow ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي');
      headerBtn.innerHTML = isDarkNow
        ? '<span aria-hidden="true">☀️</span><span class="header-theme-label">نهاري</span>'
        : '<span aria-hidden="true">🌙</span><span class="header-theme-label">ليلي</span>';
    }

    const mobileBtn = document.getElementById('mobileThemeToggleBtn');
    if (mobileBtn) {
      mobileBtn.setAttribute('aria-pressed', isDarkNow ? 'true' : 'false');
      mobileBtn.setAttribute('title', isDarkNow ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي');
      mobileBtn.setAttribute('aria-label', isDarkNow ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي');
      mobileBtn.textContent = isDarkNow ? '☀️' : '🌙';
    }

    const modeBtnMap = {
      light: document.getElementById('themeModeLightBtn'),
      dark: document.getElementById('themeModeDarkBtn'),
      auto: document.getElementById('themeModeAutoBtn')
    };
    Object.entries(modeBtnMap).forEach(([key, btn]) => {
      if (!btn) return;
      const active = key === mode;
      btn.classList.toggle('btn-primary', active);
      btn.classList.toggle('btn-secondary', !active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    const dimBtn = document.getElementById('themeDarkDimMediaBtn');
    if (dimBtn) {
      dimBtn.classList.toggle('btn-primary', dimMedia);
      dimBtn.classList.toggle('btn-secondary', !dimMedia);
      dimBtn.setAttribute('aria-pressed', dimMedia ? 'true' : 'false');
      dimBtn.innerHTML = dimMedia
        ? '<span>🌔</span> تخفيف سطوع الصور ليلاً: مفعّل'
        : '<span>🌕</span> تخفيف سطوع الصور ليلاً: معطّل';
    }

    const bookDimBtn = document.getElementById('bookPageDimToggleBtn');
    if (bookDimBtn) {
      bookDimBtn.setAttribute('aria-pressed', dimMedia ? 'true' : 'false');
      bookDimBtn.classList.toggle('btn-primary', isDarkNow && dimMedia);
      bookDimBtn.classList.toggle('btn-secondary', !(isDarkNow && dimMedia));
      bookDimBtn.innerHTML = dimMedia ? '<span>🌔</span> راحة العين' : '<span>🌕</span> سطوع كامل';
      bookDimBtn.style.display = isDarkNow ? 'inline-flex' : 'none';
    }
  }

  function applyTheme() {
    const mode = getMode();
    const effective = getEffectiveTheme(mode);
    const dimMedia = getDarkDimMedia();
    const root = document.documentElement;

    root.dataset.theme = effective;
    root.dataset.themeMode = mode;
    root.dataset.darkDimMedia = dimMedia ? 'true' : 'false';

    updateMetaThemeColor(effective);
    syncThemeUI(mode, effective, dimMedia);

    try {
      window.dispatchEvent(new CustomEvent('ies:themechange', {
        detail: { mode, effective, dimMedia }
      }));
    } catch {}

    return effective;
  }

  function setMode(mode) {
    const next = VALID_MODES.includes(mode) ? mode : 'light';
    if (typeof lsSet === 'function') {
      lsSet(THEME_MODE_KEY, next);
    } else {
      localStorage.setItem('interactive_edu_' + THEME_MODE_KEY, next);
    }
    const effective = applyTheme();
    const msg = next === 'auto'
      ? `تم ضبط المظهر على ${MODE_LABELS.auto} (الحالي: ${effective === 'dark' ? 'ليلي' : 'نهاري'})`
      : `تم تفعيل ${MODE_LABELS[next]}`;
    if (window.A11yManager && typeof window.A11yManager.announce === 'function') {
      window.A11yManager.announce(msg);
    }
    return effective;
  }

  function toggleQuick() {
    return setMode(isDark() ? 'light' : 'dark');
  }

  function toggleDarkDimMedia(force) {
    const next = typeof force === 'boolean' ? force : !getDarkDimMedia();
    if (typeof lsSet === 'function') {
      lsSet(DARK_DIM_MEDIA_KEY, next ? 'true' : 'false');
    } else {
      localStorage.setItem('interactive_edu_' + DARK_DIM_MEDIA_KEY, next ? 'true' : 'false');
    }
    applyTheme();
    if (window.A11yManager && typeof window.A11yManager.announce === 'function') {
      window.A11yManager.announce(next ? 'تم تفعيل تخفيف سطوع صفحات الكتب ليلاً' : 'تم إيقاف تخفيف سطوع صفحات الكتب ليلاً');
    }
    return next;
  }

  function resetPreferences() {
    if (typeof lsSet === 'function') {
      lsSet(THEME_MODE_KEY, 'light');
      lsSet(DARK_DIM_MEDIA_KEY, 'true');
    } else {
      localStorage.setItem('interactive_edu_' + THEME_MODE_KEY, 'light');
      localStorage.setItem('interactive_edu_' + DARK_DIM_MEDIA_KEY, 'true');
    }
    applyTheme();
    if (window.A11yManager && typeof window.A11yManager.announce === 'function') {
      window.A11yManager.announce('تمت استعادة إعدادات المظهر الافتراضية');
    }
  }

  function init() {
    applyTheme();
    if (initialized) return;
    initialized = true;

    if (window.matchMedia) {
      mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
      const onSystemThemeChange = () => {
        if (getMode() === 'auto') {
          applyTheme();
        }
      };
      if (typeof mediaQueryList.addEventListener === 'function') {
        mediaQueryList.addEventListener('change', onSystemThemeChange);
      } else if (typeof mediaQueryList.addListener === 'function') {
        mediaQueryList.addListener(onSystemThemeChange);
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        const activeEl = document.activeElement;
        if (activeEl && activeEl.isContentEditable) return;
        e.preventDefault();
        toggleQuick();
      }
    });
  }

  return {
    init,
    applyTheme,
    getMode,
    getEffectiveTheme,
    isDark,
    getDarkDimMedia,
    setMode,
    toggleQuick,
    toggleDarkDimMedia,
    resetPreferences
  };
})();

function setThemeMode(mode) {
  return window.ThemeManager.setMode(mode);
}

function toggleThemeQuick() {
  return window.ThemeManager.toggleQuick();
}

function toggleDarkDimMedia(force) {
  return window.ThemeManager.toggleDarkDimMedia(force);
}
