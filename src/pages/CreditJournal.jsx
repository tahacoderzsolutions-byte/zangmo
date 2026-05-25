import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

const emptyForm = { customer: '', amount: '', orderId: '', date: '', dueDate: '', notes: '' };

export default function CreditJournal() {
  const { creditEntries, addCreditEntry, updateCreditEntry, markCreditPaid } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = creditEntries.filter(e => {
    const matchSearch = e.customer.toLowerCase().includes(search.toLowerCase()) || e.orderId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setForm(emptyForm); setEditTarget(null); setModalOpen(true); };
  const openEdit = (entry) => { setForm({ ...entry, amount: String(entry.amount) }); setEditTarget(entry.id); setModalOpen(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editTarget) {
      updateCreditEntry(editTarget, { ...form, amount: Number(form.amount) });
    } else {
      addCreditEntry({ ...form, amount: Number(form.amount) });
    }
    setModalOpen(false);
  };

  const totalOutstanding = creditEntries.filter(e => e.status !== 'Paid').reduce((s, e) => s + e.amount, 0);
  const totalOverdue = creditEntries.filter(e => e.status === 'Overdue').reduce((s, e) => s + e.amount, 0);
  const totalPaid = creditEntries.filter(e => e.status === 'Paid').reduce((s, e) => s + e.amount, 0);

  const statusBadge = { Pending: 'bg-surface-container-high text-on-surface-variant', Overdue: 'bg-error-container text-on-error-container', Paid: 'bg-green-100 text-green-700' };

  return (
    <>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-display-lg text-display-lg text-primary">Credit Journal</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Track outstanding customer credit and collections.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2 rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-[18px]">add</span> Add Credit Entry
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Outstanding', value: `PKR ${totalOutstanding.toLocaleString()}`, icon: 'account_balance_wallet', color: 'text-secondary' },
          { label: 'Overdue', value: `PKR ${totalOverdue.toLocaleString()}`, icon: 'warning', color: 'text-error' },
          { label: 'Collected (Paid)', value: `PKR ${totalPaid.toLocaleString()}`, icon: 'check_circle', color: 'text-[#2e7d32]' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <p className="font-label-md text-label-md text-on-surface-variant">{s.label}</p>
              <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
            </div>
            <p className="font-headline-sm text-headline-sm text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant"><span className="material-symbols-outlined text-[20px]">search</span></span>
          <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:ring-2 focus:ring-primary/30 outline-none" placeholder="Search by customer or order ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 bg-surface-container p-1 rounded-lg">
          {['All', 'Pending', 'Overdue', 'Paid'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-1 rounded-md font-label-md text-label-md transition-all ${filterStatus === s ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              {['Customer', 'Order ID', 'Amount', 'Date', 'Due Date', 'Notes', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filtered.length === 0 && <tr><td colSpan={8} className="px-5 py-12 text-center text-on-surface-variant">No credit entries found.</td></tr>}
            {filtered.map(entry => (
              <tr key={entry.id} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{entry.customer.charAt(0)}</div>
                    <span className="font-body-sm font-bold text-on-surface">{entry.customer}</span>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono-data text-mono-data text-[12px]">{entry.orderId}</td>
                <td className="px-5 py-3 font-mono-data text-mono-data font-bold text-primary">PKR {entry.amount.toLocaleString()}</td>
                <td className="px-5 py-3 font-body-sm text-body-sm">{entry.date}</td>
                <td className="px-5 py-3 font-body-sm text-body-sm">{entry.dueDate}</td>
                <td className="px-5 py-3 font-body-sm text-body-sm text-on-surface-variant max-w-[140px] truncate">{entry.notes || '—'}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${statusBadge[entry.status]}`}>{entry.status}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(entry)} className="p-1 text-primary hover:bg-primary/10 rounded" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    {entry.status !== 'Paid' && (
                      <button onClick={() => markCreditPaid(entry.id)} className="p-1 text-[#2e7d32] hover:bg-green-50 rounded" title="Mark as Paid"><span className="material-symbols-outlined text-[18px]">payments</span></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Credit Entry' : 'Add Credit Entry'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant">Customer Name *</label>
            <input required className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={form.customer} onChange={e => setForm({...form, customer: e.target.value})} placeholder="e.g. Royal Events" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Order ID</label>
              <input className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={form.orderId} onChange={e => setForm({...form, orderId: e.target.value})} placeholder="#POS-00000" />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Amount (PKR) *</label>
              <input required type="number" min="1" className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0" />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Date *</label>
              <input required type="date" className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Due Date *</label>
              <input required type="date" className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant">Notes</label>
            <textarea className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none resize-none" rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Additional notes..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90">
              {editTarget ? 'Save Changes' : 'Add Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
