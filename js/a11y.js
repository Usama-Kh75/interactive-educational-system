// =========================================================================
// وحدة إمكانية الوصول الشاملة (WCAG 2.1 AA)، إدارة التركيز، وأدراج الجوال
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

window.A11yManager = (() => {
  const FONT_SCALE_VALUES = ['normal', 'large', 'xlarge'];
  const FONT_SCALE_LABELS = {
    normal: 'الحجم العادي (100%)',
    large: 'حجم كبير (112%)',
    xlarge: 'حجم كبير جداً (125%)'
  };
  const MOTION_VALUES = ['auto', 'true', 'false'];

  const modalStack = [];
  let modalObserver = null;
  let initialized = false;
  let lastAnnouncement = '';
  let announceTimer = null;

  let activeDrawerPanel = null; // 'chapters' | 'ai' | null
  let drawerOpenerEl = null;

  function getStoredFontScale() {
    const val = lsGet('a11y_font_scale');
    return FONT_SCALE_VALUES.includes(val) ? val : 'normal';
  }

  function getStoredHighContrast() {
    return lsGet('a11y_high_contrast') === 'true';
  }

  function getStoredReducedMotion() {
    const val = lsGet('a11y_reduced_motion');
    return MOTION_VALUES.includes(val) ? val : 'auto';
  }

  function applyPreferencesToDOM() {
    const root = document.documentElement;
    const scale = getStoredFontScale();
    const highContrast = getStoredHighContrast();
    const reducedMotion = getStoredReducedMotion();

    root.dataset.fontScale = scale;
    root.dataset.contrast = highContrast ? 'high' : 'normal';
    root.dataset.reducedMotion = reducedMotion;
    syncPreferencesUI(scale, highContrast, reducedMotion);
  }

  function syncPreferencesUI(scale, highContrast, reducedMotion) {
    const fontBtnMap = {
      normal: document.getElementById('a11yFontNormalBtn'),
      large: document.getElementById('a11yFontLargeBtn'),
      xlarge: document.getElementById('a11yFontXLargeBtn')
    };
    Object.entries(fontBtnMap).forEach(([key, btn]) => {
      if (!btn) return;
      const active = key === scale;
      btn.classList.toggle('btn-primary', active);
      btn.classList.toggle('btn-secondary', !active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    const hcBtn = document.getElementById('a11yHighContrastBtn');
    if (hcBtn) {
      hcBtn.setAttribute('aria-pressed', highContrast ? 'true' : 'false');
      hcBtn.classList.toggle('btn-primary', highContrast);
      hcBtn.classList.toggle('btn-secondary', !highContrast);
      hcBtn.innerHTML = highContrast ? '<span>🔆</span> التباين العالي: مفعّل' : '<span>🌓</span> تفعيل التباين العالي';
    }

    const motionBtnMap = {
      auto: document.getElementById('a11yMotionAutoBtn'),
      true: document.getElementById('a11yMotionReduceBtn'),
      false: document.getElementById('a11yMotionEnableBtn')
    };
    Object.entries(motionBtnMap).forEach(([key, btn]) => {
      if (!btn) return;
      const active = key === reducedMotion;
      btn.classList.toggle('btn-primary', active);
      btn.classList.toggle('btn-secondary', !active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    const quickFontBtn = document.getElementById('studyQuickFontBtn');
    if (quickFontBtn) {
      const shortLabel = scale === 'xlarge' ? 'أ++' : (scale === 'large' ? 'أ+' : 'أ±');
      quickFontBtn.innerHTML = `<span>🔎</span> ${shortLabel}`;
      quickFontBtn.setAttribute('aria-label', `تبديل حجم خط القراءة — الحالي: ${FONT_SCALE_LABELS[scale]}`);
      quickFontBtn.setAttribute('title', `حجم الخط الحالي: ${FONT_SCALE_LABELS[scale]}`);
    }
  }

  function announce(text, priority = 'polite') {
    const el = document.getElementById('srAnnouncer');
    if (!el || !text) return;
    const clean = String(text).replace(/\s+/g, ' ').trim();
    if (!clean) return;
    el.setAttribute('aria-live', priority === 'assertive' ? 'assertive' : 'polite');
    clearTimeout(announceTimer);
    el.textContent = '';
    lastAnnouncement = clean;
    announceTimer = setTimeout(() => {
      el.textContent = lastAnnouncement;
    }, 30);
  }

  function isElementVisible(el) {
    if (!el || el.disabled) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    return el.getClientRects().length > 0;
  }

  function getFocusableElements(container) {
    if (!container) return [];
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    return Array.from(container.querySelectorAll(selector)).filter(isElementVisible);
  }

  function getLandmarkElements() {
    return [
      document.querySelector('header'),
      document.getElementById('mainContent') || document.querySelector('main'),
      document.querySelector('footer'),
      document.getElementById('mobileBottomNav')
    ].filter(Boolean);
  }

  function setLandmarksInert(isInert) {
    getLandmarkElements().forEach(el => {
      try {
        el.inert = Boolean(isInert);
      } catch {}
      if (isInert) {
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.removeAttribute('aria-hidden');
      }
    });
  }

  function syncModalStackState() {
    const hasOpenModal = modalStack.length > 0;
    document.body.classList.toggle('modal-open', hasOpenModal || Boolean(activeDrawerPanel));
    setLandmarksInert(hasOpenModal);

    modalStack.forEach((entry, idx) => {
      const isTop = idx === modalStack.length - 1;
      try {
        entry.overlay.inert = !isTop;
      } catch {}
    });
  }

  function focusModalInitialElement(overlay) {
    const box = overlay.querySelector('.modal-box') || overlay;
    if (!box.hasAttribute('tabindex')) {
      box.setAttribute('tabindex', '-1');
    }
    const autoEl = overlay.querySelector('[data-autofocus]');
    if (autoEl && isElementVisible(autoEl)) {
      autoEl.focus({ preventScroll: true });
      return;
    }
    const focusables = getFocusableElements(box);
    if (focusables.length > 0) {
      focusables[0].focus({ preventScroll: true });
    } else {
      box.focus({ preventScroll: true });
    }
  }

  function handleModalVisibilityChange(overlay) {
    const isHidden = overlay.classList.contains('hidden');
    const existingIdx = modalStack.findIndex(item => item.overlay === overlay);

    if (!isHidden && existingIdx === -1) {
      const opener = (document.activeElement && document.activeElement !== document.body)
        ? document.activeElement
        : null;
      modalStack.push({ overlay, opener });
      syncModalStackState();
      requestAnimationFrame(() => {
        if (!overlay.classList.contains('hidden')) {
          focusModalInitialElement(overlay);
        }
      });
    } else if (isHidden && existingIdx !== -1) {
      const [removed] = modalStack.splice(existingIdx, 1);
      try { overlay.inert = false; } catch {}
      syncModalStackState();
      if (removed && removed.opener && typeof removed.opener.focus === 'function' && document.contains(removed.opener)) {
        requestAnimationFrame(() => {
          if (isElementVisible(removed.opener)) {
            removed.opener.focus({ preventScroll: true });
          }
        });
      }
    }
  }

  function initModalObserver() {
    const overlays = Array.from(document.querySelectorAll('.modal-overlay'));
    overlays.forEach(overlay => {
      const box = overlay.querySelector('.modal-box');
      if (box && !box.hasAttribute('tabindex')) {
        box.setAttribute('tabindex', '-1');
      }
      if (!overlay.classList.contains('hidden')) {
        handleModalVisibilityChange(overlay);
      }
    });

    if (modalObserver) modalObserver.disconnect();
    modalObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          if (target && target.classList && target.classList.contains('modal-overlay')) {
            handleModalVisibilityChange(target);
          }
        }
      });
    });

    overlays.forEach(overlay => {
      modalObserver.observe(overlay, { attributes: true, attributeFilter: ['class'] });
    });
  }

  function getActiveFocusTrapContainer() {
    if (modalStack.length > 0) {
      const topOverlay = modalStack[modalStack.length - 1].overlay;
      if (topOverlay && !topOverlay.classList.contains('hidden')) {
        return topOverlay.querySelector('.modal-box') || topOverlay;
      }
    }
    if (activeDrawerPanel && window.innerWidth <= 1100) {
      return activeDrawerPanel === 'chapters'
        ? document.getElementById('studyChaptersPanel')
        : document.getElementById('aiChatPanel');
    }
    return null;
  }

  function handleTabTrap(e) {
    if (e.key !== 'Tab') return;
    const container = getActiveFocusTrapContainer();
    if (!container) return;

    const focusables = getFocusableElements(container);
    if (focusables.length === 0) {
      e.preventDefault();
      container.focus({ preventScroll: true });
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (!container.contains(active)) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus({ preventScroll: true });
      return;
    }

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus({ preventScroll: true });
    }
  }

  function handleTablistArrows(e) {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    const tab = e.target && e.target.closest ? e.target.closest('[role="tab"]') : null;
    if (!tab) return;
    const tablist = tab.closest('[role="tablist"]');
    if (!tablist) return;

    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]:not([disabled])')).filter(isElementVisible);
    if (tabs.length < 2) return;

    const idx = tabs.indexOf(tab);
    if (idx === -1) return;

    const isRtl = window.getComputedStyle(tablist).direction === 'rtl';
    let nextIdx = idx;

    if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = tabs.length - 1;
    } else if (e.key === 'ArrowLeft') {
      nextIdx = isRtl ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'ArrowRight') {
      nextIdx = isRtl ? (idx - 1 + tabs.length) % tabs.length : (idx + 1) % tabs.length;
    }

    if (nextIdx !== idx) {
      e.preventDefault();
      tabs[nextIdx].focus({ preventScroll: true });
    }
  }

  function toggleMobileStudyDrawer(panelType, forceState) {
    if (window.innerWidth > 1100) return false;
    const chaptersPanel = document.getElementById('studyChaptersPanel');
    const aiPanel = document.getElementById('aiChatPanel');
    const backdrop = document.getElementById('mobileDrawerBackdrop');
    const btnChapters = document.getElementById('mobileStudyChaptersBtn');
    const btnAi = document.getElementById('mobileStudyAiBtn');

    const targetPanel = panelType === 'chapters' ? chaptersPanel : aiPanel;
    if (!targetPanel) return false;

    const currentlyOpen = activeDrawerPanel === panelType;
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !currentlyOpen;

    if (!shouldOpen) {
      return closeMobileStudyDrawers(true);
    }

    if (!activeDrawerPanel && document.activeElement && document.activeElement !== document.body) {
      drawerOpenerEl = document.activeElement;
    }

    if (chaptersPanel) chaptersPanel.classList.remove('mobile-drawer-open');
    if (aiPanel) aiPanel.classList.remove('mobile-drawer-open');

    if (panelType === 'ai' && aiPanel) {
      const studyLayout = document.querySelector('.study-layout');
      if (studyLayout) studyLayout.classList.remove('hide-ai-panel');
      aiPanel.style.display = 'flex';
    }

    targetPanel.classList.add('mobile-drawer-open');
    activeDrawerPanel = panelType;

    if (backdrop) backdrop.classList.remove('hidden');
    if (btnChapters) btnChapters.setAttribute('aria-expanded', panelType === 'chapters' ? 'true' : 'false');
    if (btnAi) btnAi.setAttribute('aria-expanded', panelType === 'ai' ? 'true' : 'false');

    syncModalStackState();

    requestAnimationFrame(() => {
      if (!targetPanel.hasAttribute('tabindex')) {
        targetPanel.setAttribute('tabindex', '-1');
      }
      const focusables = getFocusableElements(targetPanel);
      if (focusables.length > 0) {
        focusables[0].focus({ preventScroll: true });
      } else {
        targetPanel.focus({ preventScroll: true });
      }
    });

    announce(panelType === 'chapters' ? 'تم فتح فهرس الفصول والدروس' : 'تم فتح لوحة المعلم الذكي');
    return true;
  }

  function closeMobileStudyDrawers(restoreFocus = true) {
    const chaptersPanel = document.getElementById('studyChaptersPanel');
    const aiPanel = document.getElementById('aiChatPanel');
    const backdrop = document.getElementById('mobileDrawerBackdrop');
    const btnChapters = document.getElementById('mobileStudyChaptersBtn');
    const btnAi = document.getElementById('mobileStudyAiBtn');

    const wasOpen = Boolean(activeDrawerPanel);
    activeDrawerPanel = null;

    if (chaptersPanel) chaptersPanel.classList.remove('mobile-drawer-open');
    if (aiPanel) aiPanel.classList.remove('mobile-drawer-open');
    if (backdrop) backdrop.classList.add('hidden');
    if (btnChapters) btnChapters.setAttribute('aria-expanded', 'false');
    if (btnAi) btnAi.setAttribute('aria-expanded', 'false');

    syncModalStackState();

    if (wasOpen && restoreFocus && drawerOpenerEl && document.contains(drawerOpenerEl)) {
      const target = drawerOpenerEl;
      drawerOpenerEl = null;
      requestAnimationFrame(() => {
        if (isElementVisible(target)) {
          target.focus({ preventScroll: true });
        }
      });
    } else {
      drawerOpenerEl = null;
    }
    return wasOpen;
  }

  function hasOpenMobileDrawer() {
    return Boolean(activeDrawerPanel) && window.innerWidth <= 1100;
  }

  function setFontScale(scale) {
    const next = FONT_SCALE_VALUES.includes(scale) ? scale : 'normal';
    lsSet('a11y_font_scale', next);
    applyPreferencesToDOM();
    announce(`تم ضبط حجم الخط إلى ${FONT_SCALE_LABELS[next]}`);
  }

  function cycleFontScale() {
    const current = getStoredFontScale();
    const idx = FONT_SCALE_VALUES.indexOf(current);
    const next = FONT_SCALE_VALUES[(idx + 1) % FONT_SCALE_VALUES.length];
    setFontScale(next);
  }

  function toggleHighContrast(force) {
    const next = typeof force === 'boolean' ? force : !getStoredHighContrast();
    lsSet('a11y_high_contrast', next ? 'true' : 'false');
    applyPreferencesToDOM();
    announce(next ? 'تم تفعيل وضع التباين العالي' : 'تم إيقاف وضع التباين العالي');
  }

  function setReducedMotion(mode) {
    const next = MOTION_VALUES.includes(mode) ? mode : 'auto';
    lsSet('a11y_reduced_motion', next);
    applyPreferencesToDOM();
    const labelMap = {
      auto: 'الوضع التلقائي للحركة حسب النظام',
      true: 'تقليل الحركة والتأثيرات دائماً',
      false: 'تفعيل الحركة والتأثيرات'
    };
    announce(`تم ضبط إعدادات الحركة على ${labelMap[next]}`);
  }

  function resetPreferences() {
    lsSet('a11y_font_scale', 'normal');
    lsSet('a11y_high_contrast', 'false');
    lsSet('a11y_reduced_motion', 'auto');
    applyPreferencesToDOM();
    announce('تمت استعادة إعدادات إمكانية الوصول الافتراضية');
  }

  function init() {
    applyPreferencesToDOM();
    if (initialized) return;
    initialized = true;

    initModalObserver();

    document.addEventListener('keydown', (e) => {
      handleTabTrap(e);
      handleTablistArrows(e);
    }, true);

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1100 && activeDrawerPanel) {
        closeMobileStudyDrawers(false);
      }
    });
  }

  return {
    init,
    announce,
    setFontScale,
    cycleFontScale,
    toggleHighContrast,
    setReducedMotion,
    resetPreferences,
    toggleMobileStudyDrawer,
    closeMobileStudyDrawers,
    hasOpenMobileDrawer,
    applyPreferencesToDOM
  };
})();

function setA11yFontScale(scale) {
  window.A11yManager.setFontScale(scale);
}

function cycleQuickFontScale() {
  window.A11yManager.cycleFontScale();
}

function toggleA11yHighContrast(force) {
  window.A11yManager.toggleHighContrast(force);
}

function setA11yReducedMotion(mode) {
  window.A11yManager.setReducedMotion(mode);
}

function resetA11yPreferences() {
  window.A11yManager.resetPreferences();
}

function toggleMobileStudyDrawer(panelType, forceState) {
  return window.A11yManager.toggleMobileStudyDrawer(panelType, forceState);
}

function closeMobileStudyDrawers(restoreFocus = true) {
  return window.A11yManager.closeMobileStudyDrawers(restoreFocus);
}
