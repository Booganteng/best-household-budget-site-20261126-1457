// Page views for Dompet Keluarga. Each view is a function of the store and
// the selected month, and every button and form on it does what it says:
// adding, deleting, paying and editing all write back to the store.

import {
  CATEGORIES, MONTHLY_HISTORY, monthTx, monthSummary, spentByCategory,
  totalBudget, rupiah, rupiahShort, prettyDate, catLabel, catColor, uid,
  loadStore, saveStore,
} from './data.js';
import { drawMonthlyBars, drawDonut } from './charts.js';

export const MONTHS = [
  { key: '2026-10', label: 'Oktober 2026' },
  { key: '2026-11', label: 'November 2026' },
];

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function bar(pct, color) {
  const p = Math.max(0, Math.min(100, pct));
  return '<div class="meter"><div class="meter-fill" style="width:' + p + '%;background:' + color + '"></div></div>';
}

function monthNav(current) {
  const idx = MONTHS.findIndex((m) => m.key === current);
  const prev = MONTHS[idx - 1];
  const next = MONTHS[idx + 1];
  return '<div class="month-nav">' +
    (prev ? '<button class="btn ghost" data-month="' + prev.key + '">‹ ' + prev.label + '</button>' : '<span></span>') +
    '<strong>' + MONTHS[idx].label + '</strong>' +
    (next ? '<button class="btn ghost" data-month="' + next.key + '">' + next.label + ' ›</button>' : '<span></span>') +
    '</div>';
}

function billRow(b) {
  return '<li class="bill' + (b.paid ? ' paid' : '') + '">' +
    '<div><strong>' + esc(b.name) + '</strong><span>' + esc(b.note) + '</span></div>' +
    '<div class="bill-right"><span class="bill-due">Jatuh tempo ' + esc(b.due) + '</span>' +
    '<strong>' + rupiah(b.amount) + '</strong>' +
    (b.paid
      ? '<span class="tag ok">Lunas</span>'
      : '<button class="btn small" data-pay-bill="' + b.id + '">Bayar</button>') +
    '</div></li>';
}

export function viewDashboard(data, month) {
  const s = monthSummary(data, month);
  const spent = spentByCategory(data, month);
  const budgetTotal = totalBudget(data.budgets);
  const saved = s.left;
  const recent = monthTx(data, month).slice().sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id)).slice(0, 6);
  const topCats = CATEGORIES.map((c) => ({ ...c, spent: spent[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent).slice(0, 4);
  const unpaid = data.bills.filter((b) => !b.paid);
  const goal = data.goals[0];
  const goalPct = Math.round((goal.saved / goal.target) * 100);

  return '<section class="hero">' +
    '<div><p class="eyebrow">Anggaran rumah tangga · ' + esc(monthsLabel(month)) + '</p>' +
    '<h1>Uang keluarga terkendali,<br>tanpa drama akhir bulan.</h1>' +
    '<p class="lede">Dompet Keluarga mencatat setiap rupiah masuk dan keluar, membandingkan belanja dengan anggaran tiap kategori, dan menjaga target tabungan tetap jalan.</p></div>' +
    '<div class="hero-card"><span>Sisa bulan ini</span><strong>' + rupiah(saved) + '</strong>' +
    '<p>dari pemasukan ' + rupiah(s.income) + ' dikurangi pengeluaran ' + rupiah(s.expense) + '.</p>' +
    '<a class="btn primary" href="#/transaksi">+ Catat transaksi</a></div>' +
    '</section>' +
    monthNav(month) +
    '<section class="cards">' +
    '<div class="stat"><span>Pemasukan</span><strong class="in">' + rupiah(s.income) + '</strong><small>Gaji + jualan online</small></div>' +
    '<div class="stat"><span>Pengeluaran</span><strong class="out">' + rupiah(s.expense) + '</strong><small>' + monthTx(data, month).filter((t) => t.kind === 'out').length + ' transaksi bulan ini</small></div>' +
    '<div class="stat"><span>Sisa</span><strong>' + rupiah(saved) + '</strong><small>' + Math.round((saved / s.income) * 100) + '% pemasukan tersisa</small></div>' +
    '<div class="stat"><span>Anggaran terpakai</span><strong>' + Math.round((s.expense / budgetTotal) * 100) + '%</strong><small>' + rupiah(s.expense) + ' dari ' + rupiah(budgetTotal) + '</small></div>' +
    '</section>' +
    '<section class="grid-2">' +
    '<div class="card"><h2>Belanja per kategori</h2>' +
    topCats.map((c) =>
      '<div class="cat-row"><div class="cat-head"><span><i class="dot" style="background:' + c.color + '"></i>' + c.label + '</span><strong>' + rupiah(c.spent) + '</strong></div>' +
      bar((c.spent / data.budgets[c.id]) * 100, c.spent > data.budgets[c.id] ? '#b91c1c' : c.color) +
      '<small>' + (c.spent > data.budgets[c.id] ? rupiahShort(c.spent - data.budgets[c.id]) + ' lewat anggaran' : rupiahShort(data.budgets[c.id] - c.spent) + ' tersisa dari ' + rupiah(data.budgets[c.id])) + '</small></div>').join('') +
    '<a class="link-more" href="#/anggaran">Lihat semua anggaran →</a></div>' +
    '<div class="card"><h2>Transaksi terbaru</h2><ul class="tx-list">' +
    recent.map((t) =>
      '<li><span class="tx-ic ' + (t.kind === 'in' ? 'in' : '') + '">' + (t.kind === 'in' ? '+' : '−') + '</span>' +
      '<div><strong>' + esc(t.desc) + '</strong><span>' + prettyDate(t.date) + ' · ' + catLabel(t.cat) + '</span></div>' +
      '<strong class="' + (t.kind === 'in' ? 'in' : 'out') + '">' + (t.kind === 'in' ? '+' : '−') + rupiah(t.amount) + '</strong></li>').join('') +
    '</ul><a class="link-more" href="#/transaksi">Semua transaksi →</a></div>' +
    '</section>' +
    '<section class="grid-2">' +
    '<div class="card"><h2>Tagihan yang belum dibayar</h2>' +
    (unpaid.length
      ? '<ul class="bills">' + unpaid.map(billRow).join('') + '</ul>'
      : '<p class="empty">Semua tagihan bulan ini sudah lunas. 🎉</p>') +
    '<p class="hint">' + data.bills.filter((b) => b.paid).length + ' dari ' + data.bills.length + ' tagihan sudah lunas.</p></div>' +
    '<div class="card"><h2>Tabungan: ' + esc(goal.name) + '</h2>' +
    '<p class="big">' + rupiah(goal.saved) + ' <small>dari ' + rupiah(goal.target) + '</small></p>' +
    bar(goalPct, '#2e7d4f') + '<p class="hint">' + goalPct + '% tercapai — ' + esc(goal.note) + '</p>' +
    '<a class="link-more" href="#/tujuan">Semua tujuan tabungan →</a></div>' +
    '</section>';
}

function monthsLabel(month) {
  const m = MONTHS.find((x) => x.key === month);
  return m ? m.label : month;
}

export function viewTransactions(data, month, query) {
  const q = (query.q || '').toLowerCase();
  const cat = query.cat || 'all';
  let rows = monthTx(data, month).slice().sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));
  if (cat !== 'all') rows = rows.filter((t) => t.cat === cat);
  if (q) rows = rows.filter((t) => t.desc.toLowerCase().includes(q));
  const s = monthSummary(data, month);
  const opts = CATEGORIES.map((c) => '<option value="' + c.id + '"' + (cat === c.id ? ' selected' : '') + '>' + c.label + '</option>').join('');

  return '<section class="page-head"><div><p class="eyebrow">Transaksi · ' + esc(monthsLabel(month)) + '</p>' +
    '<h1>Semua pemasukan &amp; pengeluaran</h1></div>' + monthNav(month) + '</section>' +
    '<section class="cards">' +
    '<div class="stat"><span>Masuk</span><strong class="in">' + rupiah(s.income) + '</strong></div>' +
    '<div class="stat"><span>Keluar</span><strong class="out">' + rupiah(s.expense) + '</strong></div>' +
    '<div class="stat"><span>Selisih</span><strong>' + rupiah(s.left) + '</strong></div>' +
    '</section>' +
    '<section class="card"><h2>Tambah transaksi</h2>' +
    '<form id="add-tx" class="form-grid">' +
    '<label>Tanggal<input type="date" name="date" value="2026-11-26" required></label>' +
    '<label>Keterangan<input type="text" name="desc" placeholder="cth. Belanja mingguan — pasar" required maxlength="80"></label>' +
    '<label>Kategori<select name="cat">' + opts + '<option value="income">Pemasukan</option></select></label>' +
    '<label>Jumlah (Rp)<input type="number" name="amount" min="1000" step="500" placeholder="150000" required></label>' +
    '<label>Jenis<select name="kind"><option value="out">Pengeluaran</option><option value="in">Pemasukan</option></select></label>' +
    '<button class="btn primary" type="submit">Simpan transaksi</button>' +
    '</form><p class="hint">Transaksi tersimpan di browser ini dan langsung mengubah semua total di situs.</p></section>' +
    '<section class="card"><h2>Daftar transaksi <small>(' + rows.length + ' ditampilkan)</small></h2>' +
    '<div class="filters"><input id="q" type="search" placeholder="Cari keterangan…" value="' + esc(query.q || '') + '">' +
    '<select id="cat-filter"><option value="all">Semua kategori</option>' + opts + '</select></div>' +
    (rows.length ? '<table class="tx-table"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th><th></th></tr></thead><tbody>' +
      rows.map((t) => '<tr><td>' + prettyDate(t.date) + '</td><td>' + esc(t.desc) + '</td><td><span class="chip" style="--c:' + catColor(t.cat) + '">' + catLabel(t.cat) + '</span></td>' +
        '<td class="num ' + (t.kind === 'in' ? 'in' : 'out') + '">' + (t.kind === 'in' ? '+' : '−') + rupiah(t.amount) + '</td>' +
        '<td><button class="btn small danger" data-del-tx="' + t.id + '">Hapus</button></td></tr>').join('') +
      '</tbody></table>'
      : '<p class="empty">Tidak ada transaksi yang cocok. Ubah pencarian atau kategorinya.</p>') +
    '</section>';
}

export function viewBudget(data, month) {
  const spent = spentByCategory(data, month);
  const total = totalBudget(data.budgets);
  const spentTotal = Object.values(spent).reduce((a, b) => a + b, 0);
  const rows = CATEGORIES.map((c) => {
    const used = spent[c.id] || 0;
    const b = data.budgets[c.id];
    const pct = Math.round((used / b) * 100);
    const over = used > b;
    return '<tr><td><span class="dot" style="background:' + c.color + '"></span> ' + c.label + '</td>' +
      '<td class="num">' + rupiah(used) + '</td>' +
      '<td class="num"><input class="budget-input" type="number" min="0" step="50000" value="' + b + '" data-budget="' + c.id + '"></td>' +
      '<td class="bar-cell">' + bar((used / b) * 100, over ? '#b91c1c' : c.color) + '</td>' +
      '<td class="num ' + (over ? 'out' : 'in') + '">' + pct + '%</td>' +
      '<td class="num">' + (over ? '−' + rupiah(used - b) : rupiah(b - used)) + '</td></tr>';
  }).join('');

  return '<section class="page-head"><div><p class="eyebrow">Anggaran · ' + esc(monthsLabel(month)) + '</p>' +
    '<h1>Anggaran tiap kategori</h1><p class="lede">Ubah angka anggaran langsung di tabel — total di bawah ikut berubah.</p></div>' + monthNav(month) + '</section>' +
    '<section class="cards">' +
    '<div class="stat"><span>Total anggaran</span><strong>' + rupiah(total) + '</strong></div>' +
    '<div class="stat"><span>Terpakai</span><strong class="out">' + rupiah(spentTotal) + '</strong></div>' +
    '<div class="stat"><span>Sisa anggaran</span><strong>' + rupiah(total - spentTotal) + '</strong></div>' +
    '<div class="stat"><span>Kategori lewat batas</span><strong>' + CATEGORIES.filter((c) => (spent[c.id] || 0) > data.budgets[c.id]).length + ' dari ' + CATEGORIES.length + '</strong></div>' +
    '</section>' +
    '<section class="card"><table class="tx-table budget-table"><thead><tr><th>Kategori</th><th class="num">Terpakai</th><th class="num">Anggaran (Rp)</th><th>Pemakaian</th><th class="num">%</th><th class="num">Sisa</th></tr></thead><tbody>' +
    rows + '</tbody></table>' +
    '<p class="hint">Tips: belanja harian biasanya membengkak di minggu ke-3 — sisihkan Rp 500 rb di awal bulan untuk menutupnya.</p></section>';
}

export function viewGoals(data) {
  const totalSaved = data.goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = data.goals.reduce((a, g) => a + g.target, 0);
  return '<section class="page-head"><div><p class="eyebrow">Tujuan tabungan</p>' +
    '<h1>Menabung untuk yang penting</h1><p class="lede">Total terkumpul ' + rupiah(totalSaved) + ' dari target ' + rupiah(totalTarget) + '.</p></div></section>' +
    '<section class="goals-grid">' +
    data.goals.map((g) => {
      const pct = Math.round((g.saved / g.target) * 100);
      return '<article class="card goal"><h2>' + esc(g.name) + '</h2>' +
        '<p class="big">' + rupiah(g.saved) + ' <small>dari ' + rupiah(g.target) + '</small></p>' +
        bar(pct, '#2e7d4f') +
        '<p class="hint">' + pct + '% tercapai · kurang ' + rupiah(g.target - g.saved) + '</p>' +
        '<p>' + esc(g.note) + '</p>' +
        '<form class="add-funds" data-goal="' + g.id + '"><input type="number" name="amount" min="10000" step="10000" placeholder="Jumlah (Rp)" required>' +
        '<button class="btn small primary" type="submit">+ Tambah dana</button></form></article>';
    }).join('') +
    '</section>' +
    '<section class="card"><h2>Buat tujuan baru</h2>' +
    '<form id="add-goal" class="form-grid">' +
    '<label>Nama tujuan<input type="text" name="name" placeholder="cth. Umroh orang tua" required maxlength="60"></label>' +
    '<label>Target (Rp)<input type="number" name="target" min="100000" step="50000" placeholder="10000000" required></label>' +
    '<label>Sudah terkumpul (Rp)<input type="number" name="saved" min="0" step="50000" value="0"></label>' +
    '<label>Catatan<input type="text" name="note" placeholder="cth. Target akhir 2027" maxlength="90"></label>' +
    '<button class="btn primary" type="submit">Simpan tujuan</button></form></section>';
}

export function viewReports(data, month) {
  const spent = spentByCategory(data, month);
  const slices = CATEGORIES.map((c) => ({ label: c.label, value: spent[c.id] || 0, color: c.color }))
    .filter((s) => s.value > 0).sort((a, b) => b.value - a.value);
  const history = [...MONTHLY_HISTORY, { month: 'Nov 2026', ...monthSummary(data, '2026-11') }];
  const top = slices[0];
  const s = monthSummary(data, month);
  const saveRate = Math.round((s.left / s.income) * 100);
  return '<section class="page-head"><div><p class="eyebrow">Laporan · ' + esc(monthsLabel(month)) + '</p>' +
    '<h1>Ke mana uang pergi?</h1></div>' + monthNav(month) + '</section>' +
    '<section class="cards">' +
    '<div class="stat"><span>Kategori terbesar</span><strong>' + esc(top.label) + '</strong><small>' + rupiah(top.value) + ' · ' + Math.round((top.value / s.expense) * 100) + '% pengeluaran</small></div>' +
    '<div class="stat"><span>Tingkat menabung</span><strong>' + saveRate + '%</strong><small>dari pemasukan tersisa ' + rupiah(s.left) + '</small></div>' +
    '<div class="stat"><span>Rata-rata belanja / hari</span><strong>' + rupiah(Math.round(s.expense / 26)) + '</strong><small>26 hari tercatat bulan ini</small></div>' +
    '</section>' +
    '<section class="grid-2">' +
    '<div class="card"><h2>Pemasukan vs pengeluaran · 6 bulan</h2><canvas id="chart-months" aria-label="Grafik batang pemasukan dan pengeluaran enam bulan terakhir"></canvas>' +
    '<p class="hint legend"><i class="dot" style="background:#2e7d4f"></i> Pemasukan &nbsp; <i class="dot" style="background:#c2703d"></i> Pengeluaran</p></div>' +
    '<div class="card"><h2>Pengeluaran per kategori</h2><canvas id="chart-donut" aria-label="Diagram lingkaran pengeluaran per kategori"></canvas></div>' +
    '</section>' +
    '<section class="card"><h2>Unduh laporan</h2>' +
    '<p>Seluruh transaksi bulan ' + esc(monthsLabel(month)) + ' sebagai file CSV — bisa dibuka di spreadsheet apa pun.</p>' +
    '<button class="btn primary" id="export-csv">Unduh CSV (' + monthTx(data, month).length + ' baris)</button> ' +
    '<button class="btn ghost" id="reset-data">Kembalikan data awal</button></section>' +
    '<section class="card"><h2>Catatan bulan ini</h2><ul class="notes">' +
    '<li>Belanja harian sedikit lewat anggaran (' + rupiah(spent.belanja) + ' dari ' + rupiah(data.budgets.belanja) + ') — tahan jajan di minggu terakhir bulan depan.</li>' +
    '<li>Cicilan motor tinggal 21x lagi — lunas September 2028.</li>' +
    '<li>Dengan sisa ' + rupiah(s.left) + ', target dana darurat Rp 10 jt tercapai sekitar Januari 2027.</li>' +
    '</ul></section>';
}

export function drawReportCharts(data, month) {
  const months = [...MONTHLY_HISTORY, { month: 'Nov 2026', ...monthSummary(data, '2026-11') }];
  const bars = document.getElementById('chart-months');
  if (bars) drawMonthlyBars(bars, months);
  const donut = document.getElementById('chart-donut');
  if (donut) {
    const spent = spentByCategory(data, month);
    const slices = CATEGORIES.map((c) => ({ label: c.label, value: spent[c.id] || 0, color: c.color }));
    drawDonut(donut, slices);
  }
}
