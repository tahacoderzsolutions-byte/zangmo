import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ExpenseApproval() {
  const { expenses, approveExpense, rejectExpense } = useApp();
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState('');

  const pending = expenses.filter(e => e.status === 'Pending');

  const handleApprove = () => {
    if (!selected) return;
    approveExpense(selected.id);
    setSelected(null);
    setComment('');
  };

  const handleReject = () => {
    if (!selected) return;
    if (!comment.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    rejectExpense(selected.id, comment);
    setSelected(null);
    setComment('');
  };

  const catIcons = { Utilities: 'electrical_services', Salaries: 'payments', Inventory: 'inventory_2', Marketing: 'campaign', Maintenance: 'home_repair_service', Other: 'category' };
  const catColors = { Utilities: 'text-blue-500', Salaries: 'text-green-600', Inventory: 'text-secondary', Marketing: 'text-purple-500', Maintenance: 'text-yellow-600', Other: 'text-primary' };

  return (
    <div className="flex gap-6 h-full overflow-hidden">
      {/* Left: Expense Cards */}
      <section className="flex-1 overflow-y-auto pr-2 pb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-display-lg text-display-lg text-primary">Expense Approval</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {pending.length > 0 ? `${pending.length} pending submission${pending.length > 1 ? 's' : ''} awaiting review.` : 'No pending submissions. All caught up!'}
            </p>
          </div>
        </div>

        {pending.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">check_circle</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-2">All Clear!</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">No pending expense approvals at this time.</p>
          </div>
        )}

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          {pending.map(exp => {
            const isSelected = selected?.id === exp.id;
            return (
              <div
                key={exp.id}
                onClick={() => { setSelected(exp); setComment(''); }}
                className={`bg-surface-container-lowest border-2 p-5 rounded-xl flex flex-col cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-secondary shadow-md' : 'border-outline-variant hover:border-secondary/50'}`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container font-label-md text-label-md px-2 py-0.5 rounded text-[10px]">Selected</div>
                )}
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg mr-3 flex-shrink-0">
                    <span className={`material-symbols-outlined ${catColors[exp.category] || 'text-primary'}`}>{catIcons[exp.category] || 'receipt'}</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{exp.category}</p>
                    <h4 className="font-title-lg text-title-lg text-on-surface">PKR {exp.amount.toLocaleString()}</h4>
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white mr-2 flex-shrink-0">{exp.submittedBy?.charAt(0)}</div>
                  <span className="font-body-sm text-body-sm">Submitted by <strong>{exp.submittedBy}</strong></span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 flex-1">{exp.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${exp.branch === 'Zangmo' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{exp.branch}</span>
                  <span className="text-[11px] text-on-surface-variant">{exp.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Right: Details Panel */}
      {selected ? (
        <aside className="w-[380px] bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col shadow-sm flex-shrink-0">
          <div className="p-5 border-b border-outline-variant">
            <h3 className="font-headline-sm text-headline-sm text-primary">Submission Details</h3>
            <span className="inline-block mt-2 px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md rounded-full text-[11px]">Pending Verification</span>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Basic Info */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant">Category</span>
                <span className="font-body-sm font-bold">{selected.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant">Amount</span>
                <span className="font-mono-data text-mono-data font-bold text-primary">PKR {selected.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant">Branch</span>
                <span className="font-body-sm">{selected.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant">Date</span>
                <span className="font-body-sm">{selected.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant">Submitted By</span>
                <span className="font-body-sm font-bold">{selected.submittedBy}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-2 uppercase tracking-wider">Description</p>
              <div className="bg-surface-container-low p-4 rounded-lg border-l-4 border-primary">
                <p className="font-body-sm text-body-sm italic">"{selected.description}"</p>
              </div>
            </div>

            {/* Comment Field */}
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant mb-2 block uppercase tracking-wider">Owner Comment <span className="text-error">(Required for Rejection)</span></label>
              <textarea
                className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-body-sm focus:ring-2 focus:ring-secondary/30 outline-none transition-all resize-none"
                placeholder="Enter reason for rejection or notes..."
                rows={4}
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>
          </div>
          {/* Action Buttons */}
          <div className="p-5 border-t border-outline-variant grid grid-cols-2 gap-4 bg-surface-container-low">
            <button
              onClick={handleReject}
              className="bg-error text-on-error font-title-lg text-title-lg py-3 rounded-xl flex items-center justify-center hover:opacity-90 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined mr-2">close</span> Reject
            </button>
            <button
              onClick={handleApprove}
              className="bg-[#2e7d32] text-white font-title-lg text-title-lg py-3 rounded-xl flex items-center justify-center hover:opacity-90 transition-all active:scale-95 shadow-lg"
            >
              <span className="material-symbols-outlined mr-2">check_circle</span> Approve
            </button>
          </div>
        </aside>
      ) : (
        <aside className="w-[380px] bg-surface-container-low border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center text-center p-8 flex-shrink-0">
          <span className="material-symbols-outlined text-5xl text-outline mb-4">touch_app</span>
          <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Select an Expense</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Click on a pending expense card to review and take action.</p>
        </aside>
      )}
    </div>
  );
}
