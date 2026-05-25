import { useState } from 'react';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['Utilities', 'Salaries', 'Inventory', 'Marketing', 'Maintenance', 'Other'];
const BRANCHES = ['Zangmo', 'Mehdi'];

const emptyForm = { category: 'Utilities', amount: '', description: '', branch: 'Zangmo', submittedBy: 'Admin Owner', recurring: false };

export default function ExpenseManagement() {
  const { expenses, addExpense, approveExpense, rejectExpense } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.description) return;
    setSubmitting(true);
    setTimeout(() => {
      addExpense({ ...form, amount: Number(form.amount) });
      setForm(emptyForm);
      setSubmitting(false);
    }, 400);
  };

  const filtered = expenses.filter(e => {
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'All' || e.category === filterCategory;
    const matchStatus = filterStatus === 'All' || e.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const catColor = { Utilities: 'bg-blue-500', Salaries: 'bg-green-500', Inventory: 'bg-orange-500', Marketing: 'bg-purple-500', Maintenance: 'bg-yellow-500', Other: 'bg-gray-400' };
  const statusBadge = { Pending: 'bg-error-container text-on-error-container', Approved: 'bg-green-100 text-green-700', Rejected: 'bg-surface-container-high text-on-surface-variant' };

  const budgetData = CATEGORIES.map(c => ({
    category: c,
    total: expenses.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0),
    approved: expenses.filter(e => e.category === c && e.status === 'Approved').reduce((s, e) => s + e.amount, 0),
  }));
  const maxBudget = Math.max(...budgetData.map(b => b.total), 1);

  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-display-lg text-display-lg text-primary">Expense Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Track, manage, and approve operational expenditures.</p>
        </div>
        <button className="flex items-center gap-2 bg-surface-container-highest px-4 py-2 rounded-lg font-label-md text-label-md text-primary hover:bg-outline-variant transition-all">
          <span className="material-symbols-outlined text-[18px]">file_download</span> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Add Form */}
        <section className="col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 h-fit sticky top-24">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-5">Record New Expense</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Branch</label>
              <select className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-body-sm focus:ring-2 focus:ring-secondary/50 outline-none" value={form.branch} onChange={e => setForm({...form, branch: e.target.value})}>
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant">Category</label>
                <select className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-body-sm focus:ring-2 focus:ring-secondary/50 outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant">Amount (PKR)</label>
                <input required type="number" min="1" className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-body-sm focus:ring-2 focus:ring-secondary/50 outline-none" placeholder="0" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Submitted By</label>
              <input className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-body-sm focus:ring-2 focus:ring-secondary/50 outline-none" value={form.submittedBy} onChange={e => setForm({...form, submittedBy: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Description *</label>
              <textarea required className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-body-sm focus:ring-2 focus:ring-secondary/50 outline-none resize-none" placeholder="Describe the expenditure..." rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-secondary transition-colors group">
              <span className="material-symbols-outlined text-3xl text-outline mb-1 group-hover:text-secondary">cloud_upload</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Click to upload receipt</p>
              <p className="text-[10px] text-outline mt-1 uppercase tracking-wider">PNG, JPG or PDF</p>
            </div>
            <div className="flex items-center gap-3 py-1">
              <input className="w-4 h-4 text-secondary border-outline-variant rounded" id="recurring" type="checkbox" checked={form.recurring} onChange={e => setForm({...form, recurring: e.target.checked})} />
              <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="recurring">Mark as recurring monthly expense</label>
            </div>
            <button disabled={submitting} className="w-full bg-primary text-on-primary py-3 rounded-lg font-title-lg text-title-lg shadow-sm hover:opacity-90 transition-all mt-2 disabled:opacity-60" type="submit">
              {submitting ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </form>
        </section>

        {/* Right: Chart + Table */}
        <div className="col-span-8 space-y-6">
          {/* Budget by Category */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-5">Spend by Category</h3>
            <div className="space-y-3">
              {budgetData.map(b => (
                <div key={b.category} className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${catColor[b.category]}`} />
                  <span className="font-label-md text-label-md text-on-surface-variant w-24 flex-shrink-0">{b.category}</span>
                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${(b.total / maxBudget) * 100}%` }} />
                  </div>
                  <span className="font-mono-data text-mono-data text-on-surface w-28 text-right">PKR {b.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
            <div className="p-5 border-b border-outline-variant">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-headline-sm text-headline-sm text-primary">All Transactions</h3>
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">search</span></span>
                  <input className="w-full pl-9 pr-3 py-2 bg-surface border border-outline-variant rounded-lg text-body-sm focus:ring-2 focus:ring-primary/30 outline-none" placeholder="Search expenses..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <select className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:ring-2 focus:ring-primary/30 outline-none" value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}>
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:ring-2 focus:ring-primary/30 outline-none" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
                  <option value="All">All Status</option>
                  <option>Pending</option><option>Approved</option><option>Rejected</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    {['Date', 'Category', 'Description', 'Amount', 'Branch', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {paginated.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-on-surface-variant">No expenses found.</td></tr>}
                  {paginated.map(exp => (
                    <tr key={exp.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-5 py-3 font-mono-data text-mono-data text-[12px]">{exp.date}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${catColor[exp.category] || 'bg-gray-400'}`} />
                          <span className="font-body-sm text-body-sm">{exp.category}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-body-sm text-body-sm max-w-[180px] truncate" title={exp.description}>{exp.description}</td>
                      <td className="px-5 py-3 font-mono-data text-mono-data font-bold">PKR {exp.amount.toLocaleString()}</td>
                      <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-[11px] font-bold ${exp.branch === 'Zangmo' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{exp.branch}</span></td>
                      <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${statusBadge[exp.status]}`}>{exp.status}</span></td>
                      <td className="px-5 py-3">
                        {exp.status === 'Pending' && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => approveExpense(exp.id)} className="p-1 text-[#2e7d32] hover:bg-green-50 rounded" title="Approve"><span className="material-symbols-outlined text-[18px]">check_circle</span></button>
                            <button onClick={() => rejectExpense(exp.id, '')} className="p-1 text-error hover:bg-error/10 rounded" title="Reject"><span className="material-symbols-outlined text-[18px]">cancel</span></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="p-4 border-t border-outline-variant flex items-center justify-between">
                <p className="font-label-md text-label-md text-on-surface-variant">Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}</p>
                <div className="flex gap-2">
                  <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="px-3 py-1 border border-outline-variant rounded bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container disabled:opacity-40 transition-all"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                  <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)} className="px-3 py-1 border border-outline-variant rounded bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container disabled:opacity-40 transition-all"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
