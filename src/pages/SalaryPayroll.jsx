import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

const ROLES = ['Head Chef', 'Sous Chef', 'Chef de Partie', 'Commis Chef', 'Cashier', 'Waiter', 'Manager', 'Kitchen Helper', 'Delivery Rider', 'Security'];
const BRANCHES = ['Zangmo', 'Mehdi'];

const emptyForm = { name: '', role: '', branch: 'Zangmo', basicSalary: '', phone: '', joinDate: '', status: 'Active' };

export default function SalaryPayroll() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, payrollRecords, addPayrollRecord, markPayrollPaid, showToast } = useApp();

  const [tab, setTab] = useState('employees'); // 'employees' | 'payroll'
  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [payrollModal, setPayrollModal] = useState(false);
  const [payrollForm, setPayrollForm] = useState({ employeeId: '', period: 'November 2024', bonus: 0, deductions: 0 });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filtered employees
  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase());
    const matchBranch = filterBranch === 'All' || e.branch === filterBranch;
    return matchSearch && matchBranch;
  });

  // Open add modal
  const openAdd = () => { setForm(emptyForm); setEditTarget(null); setModalOpen(true); };
  // Open edit modal
  const openEdit = (emp) => { setForm({ ...emp }); setEditTarget(emp.id); setModalOpen(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editTarget) updateEmployee(editTarget, { ...form, basicSalary: Number(form.basicSalary) });
    else addEmployee({ ...form, basicSalary: Number(form.basicSalary) });
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    deleteEmployee(id);
    setDeleteConfirm(null);
  };

  const handlePayrollSubmit = (e) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === Number(payrollForm.employeeId));
    if (!emp) return;
    const net = emp.basicSalary + Number(payrollForm.bonus) - Number(payrollForm.deductions);
    addPayrollRecord({
      employeeId: emp.id,
      period: payrollForm.period,
      basicSalary: emp.basicSalary,
      bonus: Number(payrollForm.bonus),
      deductions: Number(payrollForm.deductions),
      netPay: net,
      status: 'Pending',
      paidOn: null,
    });
    setPayrollModal(false);
    setPayrollForm({ employeeId: '', period: 'November 2024', bonus: 0, deductions: 0 });
  };

  // Enrich payroll with employee name
  const enrichedPayroll = payrollRecords.map(r => ({
    ...r,
    employeeName: employees.find(e => e.id === r.employeeId)?.name || 'Unknown',
    employeeRole: employees.find(e => e.id === r.employeeId)?.role || '',
  }));

  const totalPayroll = enrichedPayroll.filter(r => r.status === 'Pending').reduce((s, r) => s + r.netPay, 0);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-display-lg text-display-lg text-primary">Salary & Payroll</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage employees and process payroll.</p>
        </div>
        <div className="flex gap-3">
          {tab === 'employees' ? (
            <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2 rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 transition-all">
              <span className="material-symbols-outlined text-[18px]">person_add</span> Add Employee
            </button>
          ) : (
            <button onClick={() => setPayrollModal(true)} className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2 rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span> Add Payroll Record
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-surface-container p-1 rounded-lg w-fit">
        {['employees', 'payroll'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded-md font-label-md text-label-md transition-all capitalize ${tab === t ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}>
            {t === 'employees' ? 'Employees' : 'Payroll Records'}
          </button>
        ))}
      </div>

      {tab === 'employees' && (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Employees', value: employees.length, icon: 'group', color: 'text-primary' },
              { label: 'Active', value: employees.filter(e => e.status === 'Active').length, icon: 'check_circle', color: 'text-[#2e7d32]' },
              { label: 'On Leave', value: employees.filter(e => e.status === 'On Leave').length, icon: 'beach_access', color: 'text-secondary' },
              { label: 'Total Salary Budget', value: `PKR ${employees.reduce((s, e) => s + e.basicSalary, 0).toLocaleString()}`, icon: 'payments', color: 'text-primary' },
            ].map(s => (
              <div key={s.label} className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-label-md text-label-md text-on-surface-variant">{s.label}</p>
                  <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                </div>
                <p className="font-headline-sm text-headline-sm text-primary">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant"><span className="material-symbols-outlined text-[20px]">search</span></span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:ring-2 focus:ring-primary/30 outline-none" placeholder="Search by name or role..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:ring-2 focus:ring-primary/30 outline-none" value={filterBranch} onChange={e => setFilterBranch(e.target.value)}>
              <option value="All">All Branches</option>
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>

          {/* Employee Table */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  {['Employee', 'Role', 'Branch', 'Basic Salary', 'Join Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-on-surface-variant">No employees found.</td></tr>
                )}
                {filtered.map(emp => (
                  <tr key={emp.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{emp.name.charAt(0)}</div>
                        <div>
                          <p className="font-body-sm font-bold text-on-surface">{emp.name}</p>
                          <p className="text-[11px] text-on-surface-variant">{emp.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-body-sm text-body-sm">{emp.role}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-[11px] font-bold ${emp.branch === 'Zangmo' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{emp.branch}</span></td>
                    <td className="px-5 py-3 font-mono-data text-mono-data font-bold">PKR {emp.basicSalary.toLocaleString()}</td>
                    <td className="px-5 py-3 font-body-sm text-body-sm">{emp.joinDate}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-surface-container-high text-on-surface-variant'}`}>{emp.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(emp)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                        <button onClick={() => setDeleteConfirm(emp)} className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors" title="Delete"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'payroll' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Pending Disbursement</p>
              <p className="font-headline-sm text-headline-sm text-error">PKR {totalPayroll.toLocaleString()}</p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Paid This Month</p>
              <p className="font-headline-sm text-headline-sm text-[#2e7d32]">PKR {enrichedPayroll.filter(r => r.status === 'Paid').reduce((s, r) => s + r.netPay, 0).toLocaleString()}</p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Total Records</p>
              <p className="font-headline-sm text-headline-sm text-primary">{enrichedPayroll.length}</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  {['Employee', 'Period', 'Basic', 'Bonus', 'Deductions', 'Net Pay', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {enrichedPayroll.map(r => (
                  <tr key={r.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-5 py-3">
                      <p className="font-body-sm font-bold text-on-surface">{r.employeeName}</p>
                      <p className="text-[11px] text-on-surface-variant">{r.employeeRole}</p>
                    </td>
                    <td className="px-5 py-3 font-body-sm text-body-sm">{r.period}</td>
                    <td className="px-5 py-3 font-mono-data text-mono-data">PKR {r.basicSalary.toLocaleString()}</td>
                    <td className="px-5 py-3 font-mono-data text-mono-data text-[#2e7d32]">+{r.bonus.toLocaleString()}</td>
                    <td className="px-5 py-3 font-mono-data text-mono-data text-error">-{r.deductions.toLocaleString()}</td>
                    <td className="px-5 py-3 font-mono-data text-mono-data font-bold text-primary">PKR {r.netPay.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${r.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-error-container text-on-error-container'}`}>{r.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      {r.status === 'Pending' && (
                        <button onClick={() => markPayrollPaid(r.id)} className="px-3 py-1 bg-primary text-on-primary text-[11px] font-bold rounded-lg hover:opacity-90 transition-all opacity-0 group-hover:opacity-100">
                          Mark Paid
                        </button>
                      )}
                      {r.status === 'Paid' && <span className="text-[11px] text-on-surface-variant">Paid {r.paidOn}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add/Edit Employee Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Employee' : 'Add New Employee'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Full Name *</label>
              <input required className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Muhammad Ali" />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Role *</label>
              <select required className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="">Select role...</option>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Branch *</label>
              <select required className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={form.branch} onChange={e => setForm({...form, branch: e.target.value})}>
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Basic Salary (PKR) *</label>
              <input required type="number" min="1" className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={form.basicSalary} onChange={e => setForm({...form, basicSalary: e.target.value})} placeholder="e.g. 25000" />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Phone</label>
              <input className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="0300-0000000" />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Join Date *</label>
              <input required type="date" className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={form.joinDate} onChange={e => setForm({...form, joinDate: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Status</label>
              <select className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option>Active</option>
                <option>On Leave</option>
                <option>Terminated</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-all">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-all">
              {editTarget ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm">
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Are you sure you want to remove <strong className="text-on-surface">{deleteConfirm?.name}</strong> from the system? This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm.id)} className="px-5 py-2 bg-error text-on-error rounded-lg font-label-md text-label-md hover:opacity-90">Delete</button>
        </div>
      </Modal>

      {/* Add Payroll Modal */}
      <Modal isOpen={payrollModal} onClose={() => setPayrollModal(false)} title="Add Payroll Record">
        <form onSubmit={handlePayrollSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant">Employee *</label>
            <select required className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={payrollForm.employeeId} onChange={e => setPayrollForm({...payrollForm, employeeId: e.target.value})}>
              <option value="">Select employee...</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant">Pay Period</label>
            <input className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={payrollForm.period} onChange={e => setPayrollForm({...payrollForm, period: e.target.value})} placeholder="e.g. November 2024" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Bonus (PKR)</label>
              <input type="number" min="0" className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={payrollForm.bonus} onChange={e => setPayrollForm({...payrollForm, bonus: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">Deductions (PKR)</label>
              <input type="number" min="0" className="w-full border border-outline-variant rounded-lg p-2.5 text-body-sm bg-surface focus:ring-2 focus:ring-primary/30 outline-none" value={payrollForm.deductions} onChange={e => setPayrollForm({...payrollForm, deductions: e.target.value})} />
            </div>
          </div>
          {payrollForm.employeeId && (
            <div className="bg-surface-container-low p-3 rounded-lg">
              <p className="text-body-sm text-on-surface-variant">Estimated Net Pay:</p>
              <p className="font-headline-sm text-headline-sm text-primary">
                PKR {((employees.find(e => e.id === Number(payrollForm.employeeId))?.basicSalary || 0) + Number(payrollForm.bonus || 0) - Number(payrollForm.deductions || 0)).toLocaleString()}
              </p>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setPayrollModal(false)} className="px-5 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90">Add Record</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
