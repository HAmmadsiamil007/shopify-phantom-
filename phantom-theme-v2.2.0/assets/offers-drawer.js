class OffersDrawerInit {
  constructor() {
    this.tooltip = document.querySelector('[data-offers-drawer-tooltip]');
    this.timerBlocks = document.querySelectorAll('[data-timer-block]');

    this.initCopyButtons();
    this.initTimerCheck();
    this.initTooltip();
  }

  initCopyButtons() {
    const containers = document.querySelectorAll('[data-copy-code]');

    containers.forEach((container) => {
      const btn = container.querySelector('[data-copy-btn]');
      const textEl = container.querySelector('[data-copy-text]');

      if (!btn || !textEl) return;

      const code = textEl.textContent.trim();

      btn.addEventListener('click', async (event) => {
        event.stopPropagation();

        try {
          await navigator.clipboard.writeText(code);
          btn.classList.add('copied');
          setTimeout(() => {
            btn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          const range = document.createRange();
          range.selectNodeContents(textEl);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
      });
    });
  }

  initTimerCheck() {
    if (this.timerBlocks.length === 0) return;

    setInterval(() => {
      this.timerBlocks.forEach((block) => {
        const timer = block.querySelector('countdown-timer');

        if (timer && timer.timerComplete) {
          block.style.display = 'none';
        }
      });
    }, 1000);
  }

  initTooltip() {
    if (!this.tooltip) return;

    try {
      const lastShown = localStorage.getItem('offers-drawer-tooltip-date');
      const today = new Date().toISOString().slice(0, 10);

      if (lastShown !== today) {
        setTimeout(() => {
          this.tooltip.classList.add('visible');
        }, 1000);

        setTimeout(() => {
          this.tooltip.classList.remove('visible');
        }, 7000);

        localStorage.setItem('offers-drawer-tooltip-date', today);
      }
    } catch (e) {
      // localStorage not available
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new OffersDrawerInit();
  });
} else {
  new OffersDrawerInit();
}
