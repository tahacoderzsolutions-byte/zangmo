import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function OwnerDashboard() {
  const { employees, expenses, creditEntries, transactions, showToast } = useApp();
  const navigate = useNavigate();

  const pendingExpenses = expenses.filter(e => e.status === 'Pending').length;
  const outstandingCredit = creditEntries.filter(e => e.status !== 'Paid').reduce((s, e) => s + e.amount, 0);
  const overdueCredit = creditEntries.filter(e => e.status === 'Overdue').length;
  const todayRevenue = transactions.filter(t => t.status === 'Paid').reduce((s, t) => s + t.amount, 0);

  const recentTransactions = transactions.slice(0, 5);

  const barHeights = [120, 150, 140, 190, 170, 210, 40];
  const barMax = Math.max(...barHeights);
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <>
      {/* KPI ROW */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "TODAY'S SALES", value: `PKR ${todayRevenue.toLocaleString()}`, sub: '+12.5%', subNote: 'from yesterday', icon: 'trending_up', iconColor: 'text-secondary', subColor: 'text-secondary' },
          { label: 'OUTSTANDING CREDIT', value: `PKR ${outstandingCredit.toLocaleString()}`, sub: 'High Priority', subNote: `${overdueCredit} overdue`, icon: 'account_balance_wallet', iconColor: 'text-error', subColor: 'text-error' },
          { label: 'TOTAL EMPLOYEES', value: employees.length, sub: `${employees.filter(e=>e.status==='Active').length} active`, subNote: `${employees.filter(e=>e.status==='On Leave').length} on leave`, icon: 'group', iconColor: 'text-primary', subColor: 'text-primary' },
          { label: 'PENDING APPROVALS', value: String(pendingExpenses).padStart(2, '0'), sub: 'Action Required', subNote: `${pendingExpenses} expenses`, icon: 'rule', iconColor: 'text-secondary', subColor: 'text-secondary' },
        ].map(k => (
          <div key={k.label} className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <p className="font-label-md text-label-md text-on-surface-variant">{k.label}</p>
              <span className={`material-symbols-outlined ${k.iconColor}`}>{k.icon}</span>
            </div>
            <p className="font-display-lg text-primary" style={{fontSize:'28px',fontWeight:700}}>{k.value}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className={`${k.subColor} font-bold text-[12px]`}>{k.sub}</span>
              <span className="text-on-surface-variant text-[12px]">{k.subNote}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="col-span-8 bg-surface-container-lowest border border-outline-variant p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-sm text-headline-sm text-primary">Sales Trend (Last 7 Days)</h2>
            <div className="flex gap-2">
              <button className="text-label-md px-3 py-1 bg-surface-container-high rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-colors">Daily</button>
              <button className="text-label-md px-3 py-1 bg-primary text-on-primary rounded-full">Weekly</button>
            </div>
          </div>
          <div className="relative h-[220px] flex items-end gap-3 px-4">
            {barHeights.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-sm bg-secondary-container hover:bg-secondary transition-colors cursor-pointer"
                  style={{ height: `${(h / barMax) * 180}px` }}
                  title={`Day: ${days[i]}`}
                />
                <span className="font-label-md text-on-surface-variant text-[10px]">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="col-span-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-lg flex flex-col">
          <h2 className="font-headline-sm text-headline-sm text-primary mb-4">Expense Breakdown</h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="relative w-36 h-36 rounded-full"
              style={{ background: 'conic-gradient(#162839 0% 45%, #944a00 45% 70%, #fc8f34 70% 85%, #d1e4fb 85% 100%)' }}
            >
              <div className="absolute inset-0 m-auto w-20 h-20 bg-surface-container-lowest rounded-full flex flex-col items-center justify-center">
                <span className="text-[10px] text-on-surface-variant">TOTAL</span>
                <span className="font-mono-data text-body-sm font-bold">{expenses.length} exp</span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 w-full">
              {[['bg-primary', 'Inventory'], ['bg-secondary', 'Salaries'], ['bg-secondary-container', 'Utilities'], ['bg-primary-fixed', 'Other']].map(([color, label]) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-label-md text-on-surface-variant">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Recent Transactions */}
        <div className="col-span-8 bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <div className="p-4 bg-surface-container border-b border-outline-variant flex justify-between items-center">
            <h2 className="font-title-lg text-title-lg text-primary">Recent Transactions</h2>
            <button onClick={() => navigate('/reports-analytics')} className="text-primary font-bold text-label-md text-label-md hover:underline">View All →</button>
          </div>
          <div className="divide-y divide-outline-variant">
            {recentTransactions.map(t => {
              const isIncome = t.status === 'Paid';
              return (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded flex items-center justify-center ${isIncome ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
                      <span className="material-symbols-outlined">{isIncome ? 'shopping_bag' : 'receipt_long'}</span>
                    </div>
                    <div>
                      <p className="text-body-sm font-bold text-on-surface">{t.orderId}</p>
                      <p className="text-[12px] text-on-surface-variant">{t.type} • {t.items} items • {t.timestamp.split(' ')[1]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono-data text-body-sm font-bold ${isIncome ? 'text-secondary' : 'text-primary'}`}>{isIncome ? '+' : '-'} PKR {t.amount.toLocaleString()}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${t.status === 'Paid' ? 'bg-green-100 text-green-800' : t.status === 'Credit' ? 'bg-yellow-100 text-yellow-800' : 'bg-error-container text-on-error-container'}`}>{t.status.toUpperCase()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts */}
        <div className="col-span-4 flex flex-col gap-4">
          {/* Low Stock */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
            <div className="p-4 bg-error-container/20 flex items-center gap-2 border-b border-outline-variant">
              <span className="material-symbols-outlined text-error">warning</span>
              <h2 className="font-title-lg text-title-lg text-on-error-container">Low Stock Alerts</h2>
            </div>
            <div className="p-4 space-y-3">
              {[{ name: 'Chicken (Fresh)', last: '2 days ago', qty: '5 KG', min: '15 KG' }, { name: 'Saffron (Premium)', last: '14 days ago', qty: '45g', min: '200g' }, { name: 'Basmati Rice', last: '5 days ago', qty: '2 Bags', min: '10 Bags' }].map(item => (
                <div key={item.name} className="flex justify-between items-center">
                  <div>
                    <p className="text-body-sm font-bold">{item.name}</p>
                    <p className="text-[12px] text-on-surface-variant">Last: {item.last}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-error font-bold text-body-sm">{item.qty}</p>
                    <p className="text-[10px] text-on-surface-variant">Min: {item.min}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => showToast('Purchase order generated!', 'success')} className="w-full py-2 bg-primary text-on-primary font-bold rounded-lg text-label-md text-label-md transition-all active:scale-95 hover:opacity-90">Generate Purchase Order</button>
            </div>
          </div>

          {/* Overdue Payments */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
            <div className="p-4 flex items-center gap-2 border-b border-outline-variant">
              <span className="material-symbols-outlined text-secondary">history</span>
              <h2 className="font-title-lg text-title-lg text-primary">Overdue Vendor Payments</h2>
            </div>
            <div className="p-4 space-y-3">
              {creditEntries.filter(c => c.status === 'Overdue').slice(0, 2).map(c => (
                <div key={c.id} className="p-3 bg-background rounded border border-outline-variant/30">
                  <div className="flex justify-between">
                    <p className="text-label-md font-bold text-on-surface">{c.customer}</p>
                    <span className="text-[10px] font-bold text-error">OVERDUE</span>
                  </div>
                  <p className="font-mono-data text-body-sm mt-1">PKR {c.amount.toLocaleString()}</p>
                </div>
              ))}
              <button onClick={() => navigate('/credit-journal')} className="w-full py-2 text-primary font-bold border-2 border-primary rounded-lg text-label-md text-label-md transition-all hover:bg-primary/5">Go to Credit Journal →</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
