// Data layer for Dompet Keluarga: seed figures for the Gunawan household in
// Bekasi, plus a tiny store that keeps every change in localStorage so the
// site remembers what the household entered. All amounts are rupiah.
// Figures are computed from the transaction rows, never typed twice, so the
// totals on every page always agree with the lists shown.

export const HOUSEHOLD = {
  name: 'Keluarga Gunawan',
  place: 'Tambun Selatan, Bekasi',
  members: 4,
  monthLabel: 'November 2026',
};

export const CATEGORIES = [
  { id: 'belanja', label: 'Belanja Harian', color: '#2e7d4f' },
  { id: 'makan', label: 'Makan & Jajan', color: '#c2703d' },
  { id: 'transport', label: 'Transportasi', color: '#3d6e9e' },
  { id: 'listrik', label: 'Listrik & Air', color: '#7a5fb5' },
  { id: 'pendidikan', label: 'Pendidikan', color: '#b5467a' },
  { id: 'kesehatan', label: 'Kesehatan', color: '#4d9b8a' },
  { id: 'cicilan', label: 'Cicilan Motor', color: '#8a6d3b' },
  { id: 'hiburan', label: 'Hiburan', color: '#5b8c5a' },
  { id: 'lainnya', label: 'Lainnya', color: '#6b7280' },
];

export const BUDGETS = {
  belanja: 2400000,
  makan: 1200000,
  transport: 900000,
  listrik: 1000000,
  pendidikan: 1500000,
  kesehatan: 500000,
  cicilan: 1250000,
  hiburan: 400000,
  lainnya: 300000,
};

// Monthly totals for June–October, used by the report chart. November is
// computed live from its own transactions.
export const MONTHLY_HISTORY = [
  { month: 'Jun 2026', income: 11800000, expense: 8940000 },
  { month: 'Jul 2026', income: 12100000, expense: 9320000 },
  { month: 'Agu 2026', income: 11900000, expense: 9105000 },
  { month: 'Sep 2026', income: 12300000, expense: 9470000 },
  { month: 'Okt 2026', income: 12100000, expense: 9180000 },
];

const SEED_TX = [
  // November 2026 — income
  { id: 't01', date: '2026-11-01', desc: 'Gaji bulanan — PT Sugity Creatives', cat: 'income', amount: 9800000, kind: 'in' },
  { id: 't02', date: '2026-11-08', desc: 'Jualan online — toko kelontong', cat: 'income', amount: 2300000, kind: 'in' },
  { id: 't03', date: '2026-11-15', desc: 'Bonus lembur akhir pekan', cat: 'income', amount: 450000, kind: 'in' },
  // November 2026 — spending
  { id: 't04', date: '2026-11-01', desc: 'Belanja mingguan — Pasar Tambun', cat: 'belanja', amount: 486000, kind: 'out' },
  { id: 't05', date: '2026-11-02', desc: 'Beras 10 kg + minyak goreng', cat: 'belanja', amount: 214000, kind: 'out' },
  { id: 't06', date: '2026-11-03', desc: 'Bensin motor — Pertamina', cat: 'transport', amount: 52000, kind: 'out' },
  { id: 't07', date: '2026-11-04', desc: 'Makan siang keluarga — warteg', cat: 'makan', amount: 87000, kind: 'out' },
  { id: 't08', date: '2026-11-05', desc: 'Cicilan motor — bulan ke-14', cat: 'cicilan', amount: 1250000, kind: 'out' },
  { id: 't09', date: '2026-11-06', desc: 'Sayur & lauk — tukang sayur', cat: 'belanja', amount: 132000, kind: 'out' },
  { id: 't10', date: '2026-11-07', desc: 'Ongkos ojek online — antar anak', cat: 'transport', amount: 68000, kind: 'out' },
  { id: 't11', date: '2026-11-08', desc: 'Belanja mingguan — supermarket', cat: 'belanja', amount: 523000, kind: 'out' },
  { id: 't12', date: '2026-11-09', desc: 'Kopi & camilan — warkop', cat: 'makan', amount: 45000, kind: 'out' },
  { id: 't13', date: '2026-11-10', desc: 'Internet rumah — IndiHome', cat: 'listrik', amount: 350000, kind: 'out' },
  { id: 't14', date: '2026-11-11', desc: 'Buku tulis & alat sekolah Anis', cat: 'pendidikan', amount: 186000, kind: 'out' },
  { id: 't15', date: '2026-11-12', desc: 'Daging ayam & telur — pasar', cat: 'belanja', amount: 178000, kind: 'out' },
  { id: 't16', date: '2026-11-13', desc: 'Bensin motor — Pertamina', cat: 'transport', amount: 50000, kind: 'out' },
  { id: 't17', date: '2026-11-14', desc: 'Makan malam — bakso & es teh', cat: 'makan', amount: 112000, kind: 'out' },
  { id: 't18', date: '2026-11-15', desc: 'Air PDAM — tagihan November', cat: 'listrik', amount: 185000, kind: 'out' },
  { id: 't19', date: '2026-11-16', desc: 'Belanja mingguan — Pasar Tambun', cat: 'belanja', amount: 461000, kind: 'out' },
  { id: 't20', date: '2026-11-17', desc: 'Obat flu & vitamin — apotek', cat: 'kesehatan', amount: 94000, kind: 'out' },
  { id: 't21', date: '2026-11-18', desc: 'Les matematika Anis — 4x pertemuan', cat: 'pendidikan', amount: 400000, kind: 'out' },
  { id: 't22', date: '2026-11-19', desc: 'Nonton bioskop — 2 tiket', cat: 'hiburan', amount: 110000, kind: 'out' },
  { id: 't23', date: '2026-11-20', desc: 'Listrik PLN — token 500 kWh', cat: 'listrik', amount: 412000, kind: 'out' },
  { id: 't24', date: '2026-11-21', desc: 'Buah & susu — toko buah', cat: 'belanja', amount: 156000, kind: 'out' },
  { id: 't25', date: '2026-11-22', desc: 'Makan siang — ayam geprek', cat: 'makan', amount: 98000, kind: 'out' },
  { id: 't26', date: '2026-11-23', desc: 'Bensin motor + parkir', cat: 'transport', amount: 64000, kind: 'out' },
  { id: 't27', date: '2026-11-24', desc: 'SPP sekolah Anis — November', cat: 'pendidikan', amount: 750000, kind: 'out' },
  { id: 't28', date: '2026-11-25', desc: 'Iuran BPJS Kesehatan — 4 jiwa', cat: 'kesehatan', amount: 280000, kind: 'out' },
  { id: 't29', date: '2026-11-26', desc: 'Belanja mingguan — supermarket', cat: 'belanja', amount: 498000, kind: 'out' },
  // October 2026 — a smaller, complete month so the month switcher is real
  { id: 'o01', date: '2026-10-01', desc: 'Gaji bulanan — PT Sugity Creatives', cat: 'income', amount: 9800000, kind: 'in' },
  { id: 'o02', date: '2026-10-09', desc: 'Jualan online — toko kelontong', cat: 'income', amount: 2300000, kind: 'in' },
  { id: 'o03', date: '2026-10-03', desc: 'Belanja mingguan — Pasar Tambun', cat: 'belanja', amount: 512000, kind: 'out' },
  { id: 'o04', date: '2026-10-05', desc: 'Cicilan motor — bulan ke-13', cat: 'cicilan', amount: 1250000, kind: 'out' },
  { id: 'o05', date: '2026-10-07', desc: 'Bensin motor — Pertamina', cat: 'transport', amount: 54000, kind: 'out' },
  { id: 'o06', date: '2026-10-10', desc: 'Internet rumah — IndiHome', cat: 'listrik', amount: 350000, kind: 'out' },
  { id: 'o07', date: '2026-10-12', desc: 'Belanja mingguan — supermarket', cat: 'belanja', amount: 489000, kind: 'out' },
  { id: 'o08', date: '2026-10-14', desc: 'SPP sekolah Anis — Oktober', cat: 'pendidikan', amount: 750000, kind: 'out' },
  { id: 'o09', date: '2026-10-16', desc: 'Makan malam keluarga', cat: 'makan', amount: 134000, kind: 'out' },
  { id: 'o10', date: '2026-10-18', desc: 'Belanja mingguan — Pasar Tambun', cat: 'belanja', amount: 445000, kind: 'out' },
  { id: 'o11', date: '2026-10-20', desc: 'Listrik PLN — token', cat: 'listrik', amount: 398000, kind: 'out' },
  { id: 'o12', date: '2026-10-22', desc: 'Les matematika Anis', cat: 'pendidikan', amount: 400000, kind: 'out' },
  { id: 'o13', date: '2026-10-25', desc: 'Iuran BPJS Kesehatan — 4 jiwa', cat: 'kesehatan', amount: 280000, kind: 'out' },
  { id: 'o14', date: '2026-10-26', desc: 'Bensin + parkir', cat: 'transport', amount: 61000, kind: 'out' },
  { id: 'o15', date: '2026-10-28', desc: 'Makan siang & jajan', cat: 'makan', amount: 121000, kind: 'out' },
  { id: 'o16', date: '2026-10-19', desc: 'Belanja mingguan — Pasar Tambun', cat: 'belanja', amount: 478000, kind: 'out' },
  { id: 'o17', date: '2026-10-21', desc: 'Makan malam — soto & es teh', cat: 'makan', amount: 142000, kind: 'out' },
  { id: 'o18', date: '2026-10-23', desc: 'Bensin motor — Pertamina', cat: 'transport', amount: 55000, kind: 'out' },
  { id: 'o19', date: '2026-10-24', desc: 'Belanja mingguan — supermarket', cat: 'belanja', amount: 502000, kind: 'out' },
  { id: 'o20', date: '2026-10-27', desc: 'Nonton bioskop + jajan', cat: 'hiburan', amount: 185000, kind: 'out' },
  { id: 'o21', date: '2026-10-29', desc: 'Periksa gigi Anis — klinik', cat: 'kesehatan', amount: 320000, kind: 'out' },
  { id: 'o22', date: '2026-10-30', desc: 'Belanja mingguan — Pasar Tambun', cat: 'belanja', amount: 486000, kind: 'out' },
  { id: 'o23', date: '2026-10-31', desc: 'Buku paket & seragam olahraga', cat: 'pendidikan', amount: 650000, kind: 'out' },
  { id: 'o24', date: '2026-10-30', desc: 'Makan siang — nasi padang', cat: 'makan', amount: 98000, kind: 'out' },
  { id: 'o25', date: '2026-10-31', desc: 'Bensin + parkir', cat: 'transport', amount: 62000, kind: 'out' },
  { id: 'o26', date: '2026-10-17', desc: 'Service motor + ganti oli', cat: 'transport', amount: 385000, kind: 'out' },
  { id: 'o27', date: '2026-10-04', desc: 'Belanja bulanan — beras & minyak', cat: 'belanja', amount: 573000, kind: 'out' },
];

const SEED_BILLS = [
  { id: 'b1', name: 'Cicilan Motor Honda', due: '28 Nov 2026', amount: 1250000, paid: true, note: 'Angsuran ke-14 dari 35' },
  { id: 'b2', name: 'SPP Sekolah Anis', due: '1 Des 2026', amount: 750000, paid: false, note: 'Kelas 2 SMK — jatuh tempo 1 Des' },
  { id: 'b3', name: 'Internet IndiHome 50 Mbps', due: '10 Des 2026', amount: 350000, paid: false, note: 'Tagihan Desember' },
  { id: 'b4', name: 'Listrik PLN', due: '20 Des 2026', amount: 412000, paid: false, note: 'Perkiraan token bulan depan' },
  { id: 'b5', name: 'BPJS Kesehatan (4 jiwa)', due: '25 Des 2026', amount: 280000, paid: false, note: 'Iuran kelas 3' },
  { id: 'b6', name: 'Air PDAM', due: '15 Des 2026', amount: 185000, paid: false, note: 'Perkiraan pemakaian November' },
];

const SEED_GOALS = [
  { id: 'g1', name: 'Dana Darurat', target: 10000000, saved: 7250000, note: '6x pengeluaran bulanan — hampir sampai' },
  { id: 'g2', name: 'DP Rumah', target: 50000000, saved: 18400000, note: 'Target 2028 — menabung Rp 1,5 jt/bulan' },
  { id: 'g3', name: 'Liburan Keluarga', target: 5000000, saved: 3100000, note: 'Pantai Anyer, libur sekolah Juni' },
  { id: 'g4', name: 'Laptop untuk Anis', target: 6500000, saved: 2750000, note: 'Untuk tugas sekolah & kuliah nanti' },
];

const KEY = 'dompet-keluarga-v1';

function seed() {
  return {
    tx: SEED_TX.map((t) => ({ ...t })),
    bills: SEED_BILLS.map((b) => ({ ...b })),
    goals: SEED_GOALS.map((g) => ({ ...g })),
    budgets: { ...BUDGETS },
  };
}

export function loadStore() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const data = JSON.parse(raw);
    if (!Array.isArray(data.tx) || !Array.isArray(data.bills) || !Array.isArray(data.goals)) return seed();
    return data;
  } catch {
    return seed();
  }
}

export function saveStore(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function resetStore() {
  const data = seed();
  saveStore(data);
  return data;
}

export function monthOf(tx) {
  return tx.date.slice(0, 7);
}

export function monthTx(data, month) {
  return data.tx.filter((t) => monthOf(t) === month);
}

export function monthSummary(data, month) {
  const rows = monthTx(data, month);
  let income = 0;
  let expense = 0;
  for (const t of rows) {
    if (t.kind === 'in') income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, left: income - expense };
}

export function spentByCategory(data, month) {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const t of monthTx(data, month)) {
    if (t.kind === 'out' && out[t.cat] !== undefined) out[t.cat] += t.amount;
  }
  return out;
}

export function totalBudget(budgets) {
  return Object.values(budgets).reduce((a, b) => a + b, 0);
}

export function rupiah(n) {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(n));
}

export function rupiahShort(n) {
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1).replace('.', ',') + ' jt';
  if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + ' rb';
  return rupiah(n);
}

export function prettyDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return d + ' ' + names[m - 1] + ' ' + y;
}

export function catLabel(id) {
  if (id === 'income') return 'Pemasukan';
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.label : id;
}

export function catColor(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.color : '#6b7280';
}

export function uid(prefix) {
  return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
}
