// Router + wiring for Dompet Keluarga. Hash routes are the site's pages:
// #/ dasbor, #/transaksi, #/anggaran, #/tujuan, #/laporan. The month lives
// in memory for the session; every mutation writes through to the store.

import {
  loadStore, saveStore, resetStore, uid, rupiah, monthTx, catLabel,
} from './data.js';
import { viewDashboard, viewTransactions, viewBudget, viewGoals, viewReports, drawReportCharts } from './views.js';

let store = loadStore();
let month = '2026-11';
let txQuery = { q: '', cat: 'all' };

const view = document.getElementById('view');

function route() {
  const hash = location.hash || '#/';
  const [path, qs] = hash.slice(2).split('?');
  const params = new URLSearchParams(qs || '');
  if (path === 'transaksi') {
    txQuery = { q: params.get('q') || txQuery.q, cat: params.get('cat') || txQuery.cat };
    view.innerHTML = viewTransactions(store, month, txQuery);
    wireTransactions();
  } else if (path === 'anggaran') {
    view.innerHTML = viewBudget(store, month);
    wireBudget();
  } else if (path === 'tujuan') {
    view.innerHTML = viewGoals(store);
    wireGoals();
  } else if (path === 'laporan') {
    view.innerHTML = viewReports(store, month);
    drawReportCharts(store, month);
    wireReports();
  } else {
    view.innerHTML = viewDashboard(store, month);
  }
  wireMonthNav();
  document.querySelectorAll('.nav-link').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#/' + (path || ''));
  });
  window.scrollTo(0, 0);
}

function rerender() {
  saveStore(store);
  route();
}

function wireMonthNav() {
  view.querySelectorAll('[data-month]').forEach((btn) => {
    btn.addEventListener('click', () => {
      month = btn.dataset.month;
      rerender();
    });
  });
}

function wireTransactions() {
  const form = document.getElementById('add-tx');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const amount = Number(f.get('amount'));
    if (!amount || amount <= 0) return;
    store.tx.push({
      id: uid('u'),
      date: String(f.get('date')),
      desc: String(f.get('desc')).trim(),
      cat: String(f.get('cat')),
      amount,
      kind: String(f.get('kind')),
    });
    month = String(f.get('date')).slice(0, 7) === '2026-10' ? '2026-10' : '2026-11';
    rerender();
  });
  const q = document.getElementById('q');
  const cat = document.getElementById('cat-filter');
  let timer = null;
  const apply = () => {
    txQuery = { q: q.value, cat: cat.value };
    const params = new URLSearchParams();
    if (txQuery.q) params.set('q', txQuery.q);
    if (txQuery.cat !== 'all') params.set('cat', txQuery.cat);
    history.replaceState(null, '', '#/transaksi' + (params.toString() ? '?' + params : ''));
    view.innerHTML = viewTransactions(store, month, txQuery);
    wireTransactions();
    wireMonthNav();
    document.getElementById('q').focus();
    document.getElementById('q').setSelectionRange(q.value.length, q.value.length);
  };
  q.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(apply, 350);
  });
  cat.addEventListener('change', apply);
  view.querySelectorAll('[data-del-tx]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!confirm('Hapus transaksi ini?')) return;
      store.tx = store.tx.filter((t) => t.id !== btn.dataset.delTx);
      rerender();
    });
  });
}

function wireBudget() {
  view.querySelectorAll('[data-budget]').forEach((input) => {
    input.addEventListener('change', () => {
      const v = Number(input.value);
      if (Number.isFinite(v) && v >= 0) {
        store.budgets[input.dataset.budget] = v;
        rerender();
      }
    });
  });
}

function wireGoals() {
  view.querySelectorAll('.add-funds').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = Number(new FormData(form).get('amount'));
      if (!amount || amount <= 0) return;
      const goal = store.goals.find((g) => g.id === form.dataset.goal);
      if (goal) goal.saved += amount;
      rerender();
    });
  });
  const form = document.getElementById('add-goal');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const target = Number(f.get('target'));
    if (!target || target <= 0) return;
    store.goals.push({
      id: uid('g'),
      name: String(f.get('name')).trim(),
      target,
      saved: Number(f.get('saved')) || 0,
      note: String(f.get('note')).trim() || 'Tujuan baru keluarga',
    });
    rerender();
  });
}

function wireReports() {
  document.getElementById('export-csv').addEventListener('click', () => {
    const rows = monthTx(store, month).slice().sort((a, b) => a.date.localeCompare(b.date));
    const lines = ['Tanggal,Keterangan,Kategori,Jenis,Jumlah (Rp)'];
    for (const t of rows) {
      const desc = '"' + t.desc.replace(/"/g, '""') + '"';
      lines.push([t.date, desc, catLabel(t.cat), t.kind === 'in' ? 'Masuk' : 'Keluar', t.amount].join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dompet-keluarga-' + month + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  document.getElementById('reset-data').addEventListener('click', () => {
    if (!confirm('Kembalikan semua data ke angka awal? Perubahanmu akan hilang.')) return;
    store = resetStore();
    month = '2026-11';
    rerender();
  });
}

// Paying a bill marks it paid and records the payment as a transaction, so
// the dashboard totals and the bill list never disagree.
view.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-pay-bill]');
  if (!btn) return;
  const bill = store.bills.find((b) => b.id === btn.dataset.payBill);
  if (!bill || bill.paid) return;
  bill.paid = true;
  store.tx.push({
    id: uid('u'),
    date: '2026-11-26',
    desc: bill.name + ' — dibayar',
    cat: bill.name.includes('Listrik') || bill.name.includes('Internet') || bill.name.includes('PDAM') ? 'listrik' : bill.name.includes('SPP') ? 'pendidikan' : bill.name.includes('BPJS') ? 'kesehatan' : 'cicilan',
    amount: bill.amount,
    kind: 'out',
  });
  rerender();
});

window.addEventListener('hashchange', route);
route();
