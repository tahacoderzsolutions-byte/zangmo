import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Toast from './Toast';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { getSearchResults } = useApp();

  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchValue.length >= 2) {
      setSearchResults(getSearchResults(searchValue));
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchValue, getSearchResults]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (!searchRef.current?.contains(e.target)) setShowResults(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleResultClick = (path) => {
    navigate(path);
    setSearchValue('');
    setShowResults(false);
  };

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/' },
    { name: 'POS', icon: 'point_of_sale', path: '#' },
    { name: 'Customers', icon: 'group', path: '#' },
    { name: 'Events', icon: 'event', path: '#' },
    { name: 'Expenses', icon: 'payments', path: '/expense-management' },
    { name: 'Expense Approval', icon: 'rule', path: '/expense-approval' },
    { name: 'Credit Journal', icon: 'menu_book', path: '/credit-journal' },
    { name: 'Reports', icon: 'analytics', path: '/reports-analytics' },
    { name: 'Branch Reports', icon: 'compare_arrows', path: '/branch-reports' },
    { name: 'Payroll', icon: 'account_balance_wallet', path: '/salary-payroll' },
    { name: 'Users', icon: 'manage_accounts', path: '#' },
    { name: 'Settings', icon: 'settings', path: '#' },
  ];

  const typeIcons = { Employee: 'person', Expense: 'receipt', Credit: 'credit_card', Transaction: 'shopping_bag' };

  return (
    <div className="flex h-screen bg-background">
      {/* SIDEBAR */}
      <aside className="flex flex-col h-full fixed left-0 top-0 z-40 bg-primary border-r border-outline-variant w-[240px]">
        <div className="px-6 py-8">
          <h1 className="font-headline-sm text-headline-sm text-on-primary font-bold">Z&M Kitchen</h1>
          <p className="font-label-md text-label-md text-on-primary-container opacity-80">Management Hub</p>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.path !== '#' && currentPath === item.path;
            const isDisabled = item.path === '#';
            return isDisabled ? (
              <span
                key={item.name}
                className="flex items-center gap-3 px-3 py-3 text-on-primary-container opacity-40 cursor-not-allowed"
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-md text-label-md">{item.name}</span>
              </span>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 transition-colors duration-200 rounded-lg ${
                  isActive
                    ? 'border-l-4 border-secondary-container bg-primary-container text-on-primary-container font-bold'
                    : 'text-on-primary-container opacity-80 hover:opacity-100 hover:bg-primary-container/50'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-md text-label-md">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-2 bg-primary-container/30 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-sm">AO</div>
            <div>
              <p className="font-label-md text-label-md text-on-primary">Admin Owner</p>
              <p className="text-[10px] text-on-primary-container/70">Z&M Kitchen</p>
            </div>
          </div>
        </div>
      </aside>

      {/* TOP NAV BAR */}
      <header className="fixed top-0 right-0 w-[calc(100%-240px)] h-16 flex justify-between items-center px-6 z-30 bg-surface-container-lowest border-b border-outline-variant">
        <div className="flex items-center gap-4">
          {/* Global Search */}
          <div className="relative" ref={searchRef}>
            <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input
              className="pl-10 pr-4 py-2 w-72 bg-surface-container text-body-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/30 outline-none transition-all"
              placeholder="Global Search..."
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onFocus={() => searchValue.length >= 2 && setShowResults(true)}
            />
            {/* Search Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl z-50 overflow-hidden">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low text-left transition-colors border-b border-outline-variant last:border-0"
                    onClick={() => handleResultClick(r.path)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-[18px]">{typeIcons[r.type]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-label-md text-label-md text-on-surface truncate">{r.label}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">{r.sub}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-surface-container rounded-full text-on-surface-variant font-bold flex-shrink-0">{r.type}</span>
                  </button>
                ))}
              </div>
            )}
            {showResults && searchValue.length >= 2 && searchResults.length === 0 && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-50 p-4 text-center">
                <span className="material-symbols-outlined text-outline text-3xl">search_off</span>
                <p className="text-body-sm text-on-surface-variant mt-1">No results found</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded text-primary font-bold transition-all hover:bg-surface-container-highest">
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            <span className="font-body-sm text-body-sm">Consolidated</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined cursor-pointer hover:bg-surface-container-high p-2 rounded-full transition-colors">notifications</span>
            <span className="material-symbols-outlined cursor-pointer hover:bg-surface-container-high p-2 rounded-full transition-colors">help</span>
            <div className="h-8 w-[1px] bg-outline-variant mx-1"></div>
            <div className="flex flex-col items-end">
              <p className="font-mono-data text-body-sm text-on-surface font-bold">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
              <p className="text-[10px] text-on-surface-variant">ONLINE</p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="ml-[240px] mt-[64px] p-6 min-h-[calc(100vh-64px)] w-[calc(100%-240px)] overflow-y-auto">
        <Outlet />
      </main>

      {/* GLOBAL TOAST */}
      <Toast />
    </div>
  );
}
