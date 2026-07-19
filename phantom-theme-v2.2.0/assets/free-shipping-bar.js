const PH_SHIPPING_STORAGE_KEY = 'ph-shipping-subtotal';
const POLL_INTERVAL = 5000;

class PhShippingBar extends HTMLElement {
  static get observedAttributes() {
    return ['data-cart-total'];
  }

  constructor() {
    super();
    this._tiers = [];
    this._subtotal = 0;
    this._currency = '';
    this._animationStyle = 'smooth';
    this._displayMode = 'inline';
    this._floatingPosition = 'bottom';
    this._templates = {};
    this._colors = {};
    this._pollTimer = null;
    this._boundCartUpdated = this._onCartUpdated.bind(this);
    this._boundHandleUpdate = this._onExternalUpdate.bind(this);
    this._boundVisibilityChange = this._onVisibilityChange.bind(this);
    this._isVisible = true;
    this._previousTierIndex = -1;
    this._unlockedTiers = new Set();
    this._state = 'loading';
    this._reduceMotion = false;
  }

  connectedCallback() {
    this._reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._displayMode = this.dataset.displayMode || 'inline';
    this._animationStyle = this.dataset.animation || 'smooth';
    this._currency = this.dataset.currency || '$';

    if (this.dataset.floatingPosition) {
      this._floatingPosition = this.dataset.floatingPosition;
    }

    this._readConfig();
    this._parseTiers();

    if (this._tiers.length === 0) {
      this.style.display = 'none';
      return;
    }

    this._sortTiers();

    const cached = this._getCachedSubtotal();
    if (cached !== null) {
      this._subtotal = cached;
      this._render();
    }

    this._fetchCart();
    this._startListening();
  }

  disconnectedCallback() {
    this._stopListening();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'data-cart-total' && oldVal !== newVal) {
      const total = parseInt(newVal, 10);
      if (!isNaN(total)) {
        this._subtotal = total;
        this._cacheSubtotal(total);
        this._render();
      }
    }
  }

  _readConfig() {
    const configEl = document.querySelector('script[data-ph-shipping-config]');
    if (!configEl) return;

    try {
      const config = JSON.parse(configEl.textContent);
      if (config.colors) this._colors = config.colors;
      if (config.templates) this._templates = config.templates;
      if (config.floatingPosition) this._floatingPosition = config.floatingPosition;
      if (config.tiers && config.tiers.length > 0) {
        this._tiers = config.tiers;
      }
      if (!this._animationStyle || this._animationStyle === 'smooth') {
        this._animationStyle = config.animationStyle || 'smooth';
      }
    } catch (e) {}
  }

  _parseTiers() {
    const templates = this.querySelectorAll('template[data-tier]');
    if (templates.length > 0) {
      this._tiers = [];
      templates.forEach((tmpl) => {
        this._tiers.push({
          threshold: parseFloat(tmpl.dataset.threshold) || 0,
          label: tmpl.dataset.label || '',
          description: tmpl.dataset.description || '',
          fill: tmpl.dataset.fill || '#D4A574',
        });
      });
    }
  }

  _sortTiers() {
    this._tiers.sort((a, b) => a.threshold - b.threshold);
  }

  _getCachedSubtotal() {
    try {
      const val = sessionStorage.getItem(PH_SHIPPING_STORAGE_KEY);
      return val ? parseInt(val, 10) : null;
    } catch (e) {
      return null;
    }
  }

  _cacheSubtotal(val) {
    try {
      sessionStorage.setItem(PH_SHIPPING_STORAGE_KEY, String(val));
    } catch (e) {}
  }

  async _fetchCart() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      this._subtotal = cart.total_price || 0;
      this._currency = cart.currency || this._currency;
      this._cacheSubtotal(this._subtotal);
      this._render();
    } catch (e) {
      this._state = 'error';
      this.innerHTML = `<div class="fsb-error">Could not load shipping info</div>`;
    }
  }

  _startListening() {
    document.addEventListener('cart:updated', this._boundCartUpdated);
    window.addEventListener('ph-shipping:update', this._boundHandleUpdate);
    document.addEventListener('visibilitychange', this._boundVisibilityChange);
    this._pollTimer = setInterval(() => this._fetchCart(), POLL_INTERVAL);
  }

  _stopListening() {
    document.removeEventListener('cart:updated', this._boundCartUpdated);
    window.removeEventListener('ph-shipping:update', this._boundHandleUpdate);
    document.removeEventListener('visibilitychange', this._boundVisibilityChange);
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  }

  _onCartUpdated() {
    this._fetchCart();
  }

  _onExternalUpdate(e) {
    if (e.detail && typeof e.detail.subtotal === 'number') {
      this._subtotal = e.detail.subtotal;
      this._cacheSubtotal(this._subtotal);
      this._render();
    }
  }

  _onVisibilityChange() {
    if (!document.hidden) {
      this._fetchCart();
    }
  }

  _calculateState() {
    if (this._subtotal <= 0) {
      return { state: 'empty', currentTier: null, nextTier: null, progress: 0 };
    }

    const maxTier = this._tiers[this._tiers.length - 1];
    if (this._subtotal >= maxTier.threshold) {
      return { state: 'complete', currentTier: maxTier, nextTier: null, progress: 100 };
    }

    let currentTier = null;
    let nextTier = null;

    for (let i = this._tiers.length - 1; i >= 0; i--) {
      if (this._subtotal >= this._tiers[i].threshold) {
        currentTier = this._tiers[i];
        nextTier = this._tiers[i + 1] || null;
        break;
      }
    }

    if (!currentTier) {
      currentTier = { threshold: 0, label: '', description: '', fill: this._colors.emptyBar || '#E8E8E8' };
      nextTier = this._tiers[0];
    }

    let progress = 0;
    if (nextTier && currentTier) {
      const range = nextTier.threshold - currentTier.threshold;
      if (range > 0) {
        progress = ((this._subtotal - currentTier.threshold) / range) * 100;
      }
    }

    return { state: 'progress', currentTier, nextTier, progress };
  }

  _formatMoney(cents) {
    const dollars = cents / 100;
    return `${this._currency}${dollars.toFixed(2)}`;
  }

  _fillTemplate(template, vars) {
    if (!template) return '';
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
      return vars[key] !== undefined ? vars[key] : match;
    });
  }

  _render() {
    const { state, currentTier, nextTier, progress } = this._calculateState();

    let message = '';
    let fillPercent = 0;
    let fillColor = this._tiers[0]?.fill || '#D4A574';
    let ariaNow = 0;

    const sortedTiers = this._tiers;
    let newUnlocked = new Set();

    if (state === 'empty') {
      message = this._templates.empty || 'Add items to your cart for free shipping!';
      fillPercent = 0;
      ariaNow = 0;
      this._state = 'empty';
    } else if (state === 'complete') {
      message = this._fillTemplate(this._templates.complete || 'All rewards unlocked! {{ max_reward }}', {
        max_reward: sortedTiers[sortedTiers.length - 1]?.label || '',
      });
      fillPercent = 100;
      fillColor = sortedTiers[sortedTiers.length - 1]?.fill || '#D4A574';
      ariaNow = 100;
      sortedTiers.forEach((t) => newUnlocked.add(t.threshold));
      this._state = 'complete';
    } else {
      if (progress >= 100) {
        fillPercent = 100;
      } else {
        fillPercent = progress;
      }

      const nextThreshold = nextTier ? this._formatMoney(nextTier.threshold * 100) : '';
      const currentLabel = currentTier?.label || '';
      const nextLabel = nextTier?.label || '';

      message = this._fillTemplate(
        this._templates.progress || 'Add {{ amount }} more for {{ reward }}',
        { amount: nextThreshold, reward: nextLabel }
      );

      if (nextTier) {
        fillColor = nextTier.fill || '#D4A574';
      }
      ariaNow = Math.round(fillPercent);

      sortedTiers.forEach((t) => {
        if (this._subtotal >= t.threshold) newUnlocked.add(t.threshold);
      });

      this._state = 'progress';
    }

    this._detectTierChange(newUnlocked);
    this._unlockedTiers = newUnlocked;

    const animClass = this._reduceMotion || this._animationStyle === 'none' ? '' : ` fsb--${this._animationStyle}`;

    requestAnimationFrame(() => {
      this.innerHTML = `
        <div class="fsb${this._displayMode === 'floating' || this._displayMode === 'both' ? ' fsb--floating' : ''}${animClass}"
          style="${this._displayMode === 'floating' || this._displayMode === 'both' ? `--fsb-float-pos: ${this._floatingPosition}` : ''}">
          <div class="fsb__inner" style="--fsb-bg: ${this._colors.bg || 'var(--ph-colorBody, #fff)'}; --fsb-text: ${this._colors.text || 'var(--ph-colorTextBody, #1c1d1d)'}">
            <div class="fsb__message" aria-live="polite">${message}</div>
            <div class="fsb__track" role="progressbar" aria-valuenow="${ariaNow}" aria-valuemin="0" aria-valuemax="100" style="--fsb-empty: ${this._colors.emptyBar || '#E8E8E8'}">
              <div class="fsb__fill${this._reduceMotion ? '' : ' fsb__fill--animated'}" style="width: ${fillPercent}%; --fsb-fill: ${fillColor}"></div>
              ${this._renderMarkers(sortedTiers)}
            </div>
          </div>
        </div>
      `;
    });
  }

  _renderMarkers(tiers) {
    return tiers
      .map((tier, i) => {
        const unlocked = this._unlockedTiers.has(tier.threshold);
        const pos = i > 0 ? (tier.threshold / tiers[tiers.length - 1].threshold) * 100 : 0;
        if (i === 0) return '';
        return `<span class="fsb__marker" style="inset-inline-start: ${pos}%" data-unlocked="${unlocked}">
          <span class="fsb__marker-icon">${unlocked ? '✓' : '🔒'}</span>
          <span class="fsb__marker-label">${tier.label}</span>
        </span>`;
      })
      .join('');
  }

  _detectTierChange(newUnlocked) {
    const prevUnlockedCount = this._unlockedTiers.size;
    const newUnlockedCount = newUnlocked.size;

    if (newUnlockedCount > prevUnlockedCount && prevUnlockedCount > 0) {
      this.dispatchEvent(new CustomEvent('ph-shipping:tier-unlocked', {
        bubbles: true,
        detail: { subtotal: this._subtotal, unlockedTiers: [...newUnlocked] },
      }));

      const otherBars = document.querySelectorAll('ph-shipping-bar');
      otherBars.forEach((bar) => {
        if (bar !== this) {
          bar.dispatchEvent(new CustomEvent('ph-shipping:update', {
            detail: { subtotal: this._subtotal },
          }));
        }
      });
    }
  }
}

customElements.define('ph-shipping-bar', PhShippingBar);
