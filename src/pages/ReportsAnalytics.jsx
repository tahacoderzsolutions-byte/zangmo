import { useState } from 'react';
import { useApp } from '../context/AppContext';

const PER_PAGE = 8;

export default function ReportsAnalytics() {
  const { transactions } = useApp();
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('Daily');
  const [page, setPage] = useState(1);

  const filtered = transactions.filter(t =>
    t.orderId.toLowerCase().includes(search.toLowerCase()) ||
    t.staff.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase()) ||
    t.status.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalRevenue = transactions.filter(t => t.status === 'Paid').reduce((s, t) => s + t.amount, 0);
  const totalOrders = transactions.length;
  const avgTicket = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const refunded = transactions.filter(t => t.status === 'Refunded').reduce((s, t) => s + t.amount, 0);

  const statusBadge = { Paid: 'bg-green-100 text-green-700', Refunded: 'bg-error-container text-on-error-container', Credit: 'bg-surface-container-high text-on-surface-variant' };

  const barData = [120000, 155000, 140000, 195000, 175000, 210000, 40000];
  const barMax = Math.max(...barData);
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-display-lg text-display-lg text-primary">Reports & Analytics</h2>
          <p className="text-on-surface-variant font-body-md">Comprehensive performance analysis for Z&M Kitchen.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-lg text-primary font-label-md text-label-md hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-[20px]">download</span> Export Excel
          </button>
          <button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all">
            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span> Export PDF
          </button>
        </div>
      </div>

      {/* Period Toggle */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex flex-wrap gap-4 items-center mb-6">
        <div className="flex bg-surface-container rounded-lg p-1">
          {['Daily', 'Monthly', 'Branch Comparison', 'Top Items'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-5 py-2 rounded-lg font-label-md text-label-md transition-all ${period === p ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: `PKR ${totalRevenue.toLocaleString()}`, trend: '+12.5%', up: true },
          { label: 'Total Orders', value: totalOrders, trend: '+8.2%', up: true },
          { label: 'Average Ticket', value: `PKR ${avgTicket.toLocaleString()}`, trend: '-2.1%', up: false },
          { label: 'Refunded', value: `PKR ${refunded.toLocaleString()}`, trend: '0.3%', up: false },
        ].map(k => (
          <div key={k.label} className="bg-white border border-outline-variant p-5 rounded-xl shadow-sm">
            <p className="text-on-surface-variant font-label-md mb-2">{k.label}</p>
            <div className="flex justify-between items-end">
              <h3 className="font-display-lg text-display-lg text-primary text-[24px]">{k.value}</h3>
              <div className={`flex items-center font-bold text-label-md mb-1 ${k.up ? 'text-[#2e7d32]' : 'text-error'}`}>
                <span className="material-symbols-outlined text-[16px] mr-1">{k.up ? 'trending_up' : 'trending_down'}</span>
                {k.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white border border-outline-variant rounded-xl shadow-sm mb-6 p-6">
        <h4 className="font-title-lg text-title-lg text-primary mb-4">Revenue Trend</h4>
        <div className="relative h-48 flex items-end gap-3 px-4">
          {barData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-sm bg-primary/80 hover:bg-secondary transition-colors cursor-pointer"
                style={{ height: `${(val / barMax) * 160}px` }}
                title={`PKR ${val.toLocaleString()}`}
              />
              <span className="font-label-md text-[10px] text-on-surface-variant">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
          <h4 className="font-title-lg text-title-lg text-primary">Transaction History</h4>
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">search</span></span>
            <input
              className="w-full pl-9 pr-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-body-sm focus:ring-2 focus:ring-primary/30 outline-none"
              placeholder="Search transactions..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Staff</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {paginated.length === 0 && <tr><td colSpan={7} className="px-6 py-10 text-center text-on-surface-variant">No transactions found.</td></tr>}
              {paginated.map(t => (
                <tr key={t.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4 font-mono-data text-primary">{t.orderId}</td>
                  <td className="px-6 py-4 font-body-sm text-body-sm">{t.timestamp}</td>
                  <td className="px-6 py-4 font-body-sm text-body-sm">{t.staff}</td>
                  <td className="px-6 py-4 font-body-sm text-body-sm">{t.type}</td>
                  <td className="px-6 py-4 font-body-sm text-body-sm">{t.items} Items</td>
                  <td className="px-6 py-4 font-mono-data text-primary text-right font-bold">PKR {t.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${statusBadge[t.status] || 'bg-surface-container text-on-surface-variant'}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
          <p className="text-label-md text-on-surface-variant font-label-md">Showing {filtered.length === 0 ? 0 : (page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length} transactions</p>
          <div className="flex gap-2">
            <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded-md bg-white hover:bg-surface-container disabled:opacity-40 transition-all"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
            {Array.from({length: totalPages}, (_, i) => i+1).map(n => (
              <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 flex items-center justify-center border rounded-md text-[12px] font-bold transition-all ${page===n ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant bg-white hover:bg-surface-container'}`}>{n}</button>
            ))}
            <button disabled={page===totalPages || totalPages===0} onClick={() => setPage(p=>p+1)} className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded-md bg-white hover:bg-surface-container disabled:opacity-40 transition-all"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
          </div>
        </div>
      </div>
    </>
  );
}
