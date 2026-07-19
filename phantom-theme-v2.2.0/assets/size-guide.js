class SizeGuideModal extends HTMLElement {
  connectedCallback() {
    const dialog = this.querySelector('dialog');
    const openTriggers = document.querySelectorAll('[data-open-size-guide]');
    const closeBtn = this.querySelector('[data-size-close]');
    const inputs = this.querySelectorAll('[data-size-input]');
    const result = this.querySelector('[data-size-result]');
    const sizeRows = this.querySelectorAll('[data-size-row]');

    if (!dialog) return;

    openTriggers.forEach(t => t.addEventListener('click', (e) => {
      e.preventDefault();
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    }));

    closeBtn?.addEventListener('click', () => this.close(dialog));

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) this.close(dialog);
    });

    dialog.addEventListener('cancel', () => {
      document.body.style.overflow = '';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dialog.open) {
        this.close(dialog);
      }
    });

    inputs.forEach(input => {
      input.addEventListener('input', () => this.calculate(inputs, sizeRows, result));
    });
  }

  close(dialog) {
    dialog.close();
    document.body.style.overflow = '';
  }

  calculate(inputs, rows, resultEl) {
    const vals = Array.from(inputs).map(i => parseFloat(i.value) || 0);
    if (vals.some(v => v === 0)) { resultEl.textContent = ''; resultEl.classList.add('is-hidden'); return; }

    let bestMatch = null;
    let bestDiff = Infinity;

    rows.forEach(row => {
      const chestMin = parseFloat(row.dataset.chestMin || 0);
      const chestMax = parseFloat(row.dataset.chestMax || 999);
      const waistMin = parseFloat(row.dataset.waistMin || 0);
      const waistMax = parseFloat(row.dataset.waistMax || 999);
      const hipMin = parseFloat(row.dataset.hipMin || 0);
      const hipMax = parseFloat(row.dataset.hipMax || 999);

      if (vals[0] >= chestMin && vals[0] <= chestMax &&
          vals[1] >= waistMin && vals[1] <= waistMax &&
          vals[2] >= hipMin && vals[2] <= hipMax) {
        const diff = Math.abs(vals[0] - (chestMin + chestMax) / 2) +
                     Math.abs(vals[1] - (waistMin + waistMax) / 2) +
                     Math.abs(vals[2] - (hipMin + hipMax) / 2);
        if (diff < bestDiff) { bestDiff = diff; bestMatch = row; }
      }
    });

    if (bestMatch) {
      resultEl.textContent = bestMatch.dataset.recommendation || 'This size fits you best';
      resultEl.classList.remove('is-hidden');
    } else {
      resultEl.textContent = 'No exact match found. Try your closest measurements or contact us for help.';
      resultEl.classList.remove('is-hidden');
    }
  }
}
customElements.define('size-guide-modal', SizeGuideModal);
