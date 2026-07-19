class QuizRecommendation extends HTMLElement {
  connectedCallback() {
    this.intro = this.querySelector('[data-quiz-intro]');
    this.questions = Array.from(this.querySelectorAll('[data-quiz-question]'));
    this.results = this.querySelector('[data-quiz-results]');
    this.cards = this.querySelector('[data-quiz-cards]');
    this.progress = this.querySelector('[data-quiz-progress]');
    this.progressFill = this.querySelector('[data-quiz-progress-fill]');
    this.progressLabel = this.querySelector('[data-quiz-progress-label]');
    this.noResults = this.querySelector('[data-quiz-no-results]');
    this.resetBtn = this.querySelector('[data-quiz-reset]');
    this.startBtn = this.querySelector('[data-quiz-start]');
    this.productsToShow = parseInt(this.dataset.productsToShow) || 3;

    this.scores = {};
    this.currentQuestion = 0;
    this.animationStyle = this.dataset.animationStyle || 'slide';
    this.matchingMode = this.dataset.matchingMode || 'intersection';

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = mq.matches;
    mq.addEventListener('change', (e) => { this.reducedMotion = e.matches; });

    this.startBtn?.addEventListener('click', () => this.start());
    this.resetBtn?.addEventListener('click', () => this.reset());

    this.questions.forEach((q, i) => {
      q.querySelectorAll('[data-quiz-option]').forEach(opt => {
        opt.addEventListener('click', () => this.selectOption(i, opt));
      });
    });
  }

  start() {
    this.intro?.classList.add('is-hidden');
    this.showQuestion(0);
  }

  showQuestion(index) {
    if (index >= this.questions.length) { this.showResults(); return; }
    this.questions.forEach((q, i) => {
      q.classList.toggle('is-hidden', i !== index);
      if (!this.reducedMotion && i === index) {
        q.style.animation = 'quizFadeIn 0.4s ease forwards';
      }
    });
    this.currentQuestion = index;
    this.updateProgress();
  }

  updateProgress() {
    if (!this.progress || !this.progressFill) return;
    const pct = ((this.currentQuestion + 1) / this.questions.length) * 100;
    this.progressFill.style.width = `${pct}%`;
    if (this.progressLabel) {
      this.progressLabel.textContent = `${this.currentQuestion + 1} / ${this.questions.length}`;
    }
  }

  selectOption(questionIndex, opt) {
    const handles = (opt.dataset.productHandles || '').split(',').filter(Boolean);
    const weight = parseFloat(opt.dataset.weight) || 1;

    if (this.matchingMode === 'weighted-score') {
      handles.forEach(h => { this.scores[h] = (this.scores[h] || 0) + weight; });
    } else {
      if (!this._accumulated) this._accumulated = [];
      this._accumulated.push(...handles);
    }

    this.showQuestion(questionIndex + 1);
  }

  async showResults() {
    this.questions.forEach(q => q.classList.add('is-hidden'));
    this.results?.classList.remove('is-hidden');
    if (!this.reducedMotion) this.results.style.animation = 'quizFadeIn 0.5s ease forwards';

    let handles;
    if (this.matchingMode === 'weighted-score') {
      handles = Object.entries(this.scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, this.productsToShow)
        .map(([h]) => h);
    } else {
      const freq = {};
      (this._accumulated || []).forEach(h => { freq[h] = (freq[h] || 0) + 1; });
      handles = [...new Set(this._accumulated || [])]
        .sort((a, b) => freq[b] - freq[a])
        .slice(0, this.productsToShow);
    }

    if (handles.length === 0) {
      this.noResults?.classList.remove('is-hidden');
      return;
    }

    this.noResults?.classList.add('is-hidden');
    const slots = this.querySelectorAll('[data-quiz-card-slot]');
    const promises = handles.map((handle, i) => {
      if (slots[i]) return this.fetchProduct(handle, slots[i]);
    });
    await Promise.all(promises);
  }

  async fetchProduct(handle, slot) {
    slot.classList.add('is-loading');
    try {
      const cached = this._getCache(handle);
      if (cached) { slot.innerHTML = cached; slot.classList.remove('is-loading'); return; }

      const res = await fetch(`${window.Shopify?.routes?.root || '/'}products/${handle}.js`);
      if (!res.ok) throw new Error('not found');
      const p = await res.json();
      const money = window.Shopify?.formatMoney
        ? window.Shopify.formatMoney(p.price)
        : `$${(p.price / 100).toFixed(2)}`;

      const html = `<div class="quiz-product-card">
        <a href="/products/${p.handle}">
          <img src="${p.featured_image || ''}" alt="${p.title}" loading="lazy" width="200" height="200" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px">
        </a>
        <h4 style="margin:8px 0 4px;font-size:0.95em"><a href="/products/${p.handle}" style="color:inherit;text-decoration:none">${p.title}</a></h4>
        <span style="font-weight:600">${money}</span>
        <form method="post" action="/cart/add" style="margin-top:8px">
          <input type="hidden" name="id" value="${p.variants[0]?.id}">
          <input type="hidden" name="quantity" value="1">
          <button type="submit" class="btn btn--small btn--full" style="width:100%">Add to Cart</button>
        </form>
      </div>`;

      this._setCache(handle, html);
      slot.innerHTML = html;
    } catch {
      slot.innerHTML = '';
    }
    slot.classList.remove('is-loading');
  }

  _getCache(handle) {
    try { return sessionStorage.getItem(`ph-quiz-${handle}`); } catch { return null; }
  }

  _setCache(handle, html) {
    try { sessionStorage.setItem(`ph-quiz-${handle}`, html); } catch {}
  }

  reset() {
    this.scores = {};
    this._accumulated = [];
    this.currentQuestion = 0;
    this.results?.classList.add('is-hidden');
    this.noResults?.classList.add('is-hidden');
    this.querySelectorAll('[data-quiz-card-slot]').forEach(s => { s.innerHTML = ''; s.classList.remove('is-loading'); });
    this.intro?.classList.remove('is-hidden');
    this.updateProgress();
  }
}
customElements.define('quiz-recommendation', QuizRecommendation);
