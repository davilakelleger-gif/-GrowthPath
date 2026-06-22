// ======================== CHARTS ENGINE ========================
const Charts = {
  createDonut(canvas, pct, color) {
    if (!canvas) return;
    const r = canvas.width / 2 - 4;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    canvas.innerHTML = `
      <svg width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
        <circle cx="${canvas.width/2}" cy="${canvas.height/2}" r="${r}" fill="none" stroke="var(--border)" stroke-width="4"/>
        <circle cx="${canvas.width/2}" cy="${canvas.height/2}" r="${r}" fill="none" stroke="${color || 'var(--primary)'}" 
          stroke-width="4" stroke-dasharray="${circ}" stroke-dashoffset="${offset}" 
          transform="rotate(-90, ${canvas.width/2}, ${canvas.height/2})" stroke-linecap="round"
          style="transition: stroke-dashoffset 1s ease"/>
      </svg>
    `;
  },

  createBarChart(container, data, options = {}) {
    if (!container) return;
    const { height = 160, maxValue, barColor, barRadius = 6 } = options;
    const max = maxValue || Math.max(...data.map(d => d.value), 1);
    container.style.height = height + 'px';
    container.innerHTML = data.map(d => {
      const h = Math.max(4, (d.value / max) * (height - 20));
      return `
        <div class="bar-item">
          <div class="bar" style="height:${h}px;background:${barColor || 'linear-gradient(180deg, var(--primary), var(--accent))'};border-radius:${barRadius}px ${barRadius}px 2px 2px"></div>
          <span>${d.label}</span>
        </div>
      `;
    }).join('');
  },

  createLineChart(container, data, options = {}) {
    if (!container) return;
    const { width = container.clientWidth || 300, height = 180, color = '#2563EB' } = options;
    const max = Math.max(...data, 1);
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * (width - 40) + 20;
      const y = height - 20 - ((v / max) * (height - 40));
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `20,${height - 20} ${points} ${width - 20},${height - 20}`;

    container.innerHTML = `
      <svg class="line-chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polyline points="${points}" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <polygon points="${areaPoints}" fill="url(#chartGrad)"/>
      </svg>
    `;
  }
};
