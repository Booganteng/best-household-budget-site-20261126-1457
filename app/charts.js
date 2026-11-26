// Canvas charts for Dompet Keluarga, drawn with no library: a grouped bar
// chart for monthly income vs spending, and a donut for spending by
// category. Every chart draws from the same figures the tables show.

function setupCanvas(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function moneyLabel(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.', ',') + ' jt';
  return Math.round(n / 1000) + ' rb';
}

export function drawMonthlyBars(canvas, months) {
  // months: [{month, income, expense}]
  const { ctx, width, height } = setupCanvas(canvas, 260);
  const padL = 46, padR = 12, padT = 18, padB = 30;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const max = Math.max(...months.flatMap((m) => [m.income, m.expense])) * 1.08;
  ctx.clearRect(0, 0, width, height);
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const v = (max / 1.08) * (i / 4);
    const y = padT + plotH - (plotH * i) / 4;
    ctx.fillText(moneyLabel(v), padL - 8, y + 4);
    ctx.strokeStyle = i === 0 ? '#d1d5db' : '#eef0f2';
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(width - padR, y);
    ctx.stroke();
  }
  const groupW = plotW / months.length;
  const barW = Math.min(26, groupW * 0.28);
  months.forEach((m, i) => {
    const cx = padL + groupW * i + groupW / 2;
    const inH = (m.income / max) * plotH;
    const exH = (m.expense / max) * plotH;
    ctx.fillStyle = '#2e7d4f';
    ctx.beginPath();
    ctx.roundRect(cx - barW - 3, padT + plotH - inH, barW, inH, [3, 3, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#c2703d';
    ctx.beginPath();
    ctx.roundRect(cx + 3, padT + plotH - exH, barW, exH, [3, 3, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';
    ctx.fillText(m.month, cx, height - 10);
  });
}

export function drawDonut(canvas, slices) {
  // slices: [{label, value, color}] — values must already be the month's own
  const total = slices.reduce((a, s) => a + s.value, 0);
  const { ctx, width, height } = setupCanvas(canvas, 240);
  const cx = width * 0.32;
  const cy = height / 2;
  const r = Math.min(88, height / 2 - 14);
  const inner = r * 0.62;
  ctx.clearRect(0, 0, width, height);
  if (total <= 0) {
    ctx.fillStyle = '#9ca3af';
    ctx.font = '13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Belum ada pengeluaran', cx, cy);
    return;
  }
  let a0 = -Math.PI / 2;
  for (const s of slices) {
    if (s.value <= 0) continue;
    const a1 = a0 + (s.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a0, a1);
    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.fill();
    a0 = a1;
  }
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Rp ' + (total / 1000000).toFixed(1).replace('.', ',') + ' jt', cx, cy - 2);
  ctx.fillStyle = '#6b7280';
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillText('total belanja', cx, cy + 15);
  // Legend on the right
  const lx = width * 0.62;
  let ly = 18;
  ctx.textAlign = 'left';
  ctx.font = '12px system-ui, sans-serif';
  for (const s of slices) {
    if (s.value <= 0) continue;
    ctx.fillStyle = s.color;
    ctx.fillRect(lx, ly - 9, 10, 10);
    ctx.fillStyle = '#374151';
    const pct = Math.round((s.value / total) * 100);
    ctx.fillText(s.label + ' · ' + pct + '%', lx + 16, ly);
    ly += 24;
  }
}
