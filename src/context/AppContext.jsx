import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initialEmployees = [
  { id: 1, name: 'Ahmed Khan', role: 'Head Chef', branch: 'Zangmo', basicSalary: 45000, joinDate: '2022-03-15', status: 'Active', phone: '0300-1234567' },
  { id: 2, name: 'Sara Malik', role: 'Sous Chef', branch: 'Mehdi', basicSalary: 35000, joinDate: '2022-06-01', status: 'Active', phone: '0311-9876543' },
  { id: 3, name: 'Zainab Bibi', role: 'Cashier', branch: 'Zangmo', basicSalary: 22000, joinDate: '2023-01-10', status: 'Active', phone: '0333-5551234' },
  { id: 4, name: 'Usman Farooq', role: 'Waiter', branch: 'Mehdi', basicSalary: 18000, joinDate: '2023-04-20', status: 'Active', phone: '0321-7778899' },
  { id: 5, name: 'Fatima Noor', role: 'Manager', branch: 'Zangmo', basicSalary: 55000, joinDate: '2021-11-05', status: 'Active', phone: '0345-1112233' },
  { id: 6, name: 'Bilal Akram', role: 'Kitchen Helper', branch: 'Mehdi', basicSalary: 15000, joinDate: '2023-09-01', status: 'On Leave', phone: '0312-4445566' },
];

const initialExpenses = [
  { id: 1, date: '2024-10-24', category: 'Utilities', description: 'Water bill - Main Kitchen', amount: 12400, branch: 'Zangmo', status: 'Pending', submittedBy: 'Ahmed Khan', receipt: null },
  { id: 2, date: '2024-10-22', category: 'Salaries', description: 'Weekly Wages - Shift A', amount: 45000, branch: 'Zangmo', status: 'Approved', submittedBy: 'Fatima Noor', receipt: null },
  { id: 3, date: '2024-10-21', category: 'Inventory', description: 'Dry goods restock', amount: 8405, branch: 'Mehdi', status: 'Approved', submittedBy: 'Sara Malik', receipt: null },
  { id: 4, date: '2024-10-20', category: 'Maintenance', description: 'Oven repair - Unit 4', amount: 2150, branch: 'Zangmo', status: 'Pending', submittedBy: 'Ahmed Khan', receipt: null },
  { id: 5, date: '2024-10-19', category: 'Inventory', description: 'Bulk purchase vegetable oil & flour', amount: 28500, branch: 'Mehdi', status: 'Pending', submittedBy: 'Usman Farooq', receipt: null },
  { id: 6, date: '2024-10-18', category: 'Utilities', description: 'Electricity bill - Branch B', amount: 18200, branch: 'Mehdi', status: 'Approved', submittedBy: 'Sara Malik', receipt: null },
];

const initialTransactions = [
  { id: 1, orderId: '#POS-82910', timestamp: '2024-10-07 14:23', staff: 'Ahmed K.', items: 4, amount: 11250, status: 'Paid', type: 'Dining' },
  { id: 2, orderId: '#POS-82909', timestamp: '2024-10-07 14:18', staff: 'Sara M.', items: 2, amount: 4500, status: 'Paid', type: 'Takeaway' },
  { id: 3, orderId: '#POS-82908', timestamp: '2024-10-07 14:12', staff: 'Ahmed K.', items: 1, amount: 1250, status: 'Refunded', type: 'Takeaway' },
  { id: 4, orderId: '#POS-82907', timestamp: '2024-10-07 13:55', staff: 'Zainab B.', items: 5, amount: 16800, status: 'Paid', type: 'Dining' },
  { id: 5, orderId: '#POS-82906', timestamp: '2024-10-07 13:30', staff: 'Usman F.', items: 3, amount: 8900, status: 'Credit', type: 'Dining' },
  { id: 6, orderId: '#POS-82905', timestamp: '2024-10-07 12:45', staff: 'Ahmed K.', items: 6, amount: 21500, status: 'Paid', type: 'Event' },
];

const initialCreditEntries = [
  { id: 1, customer: 'Asim Enterprises', amount: 15000, date: '2024-10-01', dueDate: '2024-10-31', status: 'Overdue', orderId: '#POS-82850', notes: 'Regular client, 30-day credit' },
  { id: 2, customer: 'Maryam Cafe', amount: 8500, date: '2024-10-10', dueDate: '2024-11-10', status: 'Pending', orderId: '#POS-82870', notes: 'Bulk catering order' },
  { id: 3, customer: 'Royal Events', amount: 45000, date: '2024-09-20', dueDate: '2024-10-20', status: 'Overdue', orderId: '#POS-82800', notes: 'Wedding catering - partial payment received' },
  { id: 4, customer: 'Tariq & Sons', amount: 12000, date: '2024-10-15', dueDate: '2024-11-15', status: 'Pending', orderId: '#POS-82890', notes: '' },
  { id: 5, customer: 'Sana Traders', amount: 6800, date: '2024-10-18', dueDate: '2024-11-18', status: 'Paid', orderId: '#POS-82900', notes: 'Paid in full' },
];

const initialPayrollRecords = [
  { id: 1, employeeId: 1, period: 'October 2024', basicSalary: 45000, bonus: 5000, deductions: 2000, netPay: 48000, status: 'Paid', paidOn: '2024-10-31' },
  { id: 2, employeeId: 2, period: 'October 2024', basicSalary: 35000, bonus: 0, deductions: 1500, netPay: 33500, status: 'Paid', paidOn: '2024-10-31' },
  { id: 3, employeeId: 3, period: 'October 2024', basicSalary: 22000, bonus: 2000, deductions: 1000, netPay: 23000, status: 'Pending', paidOn: null },
  { id: 4, employeeId: 4, period: 'October 2024', basicSalary: 18000, bonus: 0, deductions: 800, netPay: 17200, status: 'Pending', paidOn: null },
  { id: 5, employeeId: 5, period: 'October 2024', basicSalary: 55000, bonus: 10000, deductions: 3000, netPay: 62000, status: 'Paid', paidOn: '2024-10-31' },
];

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [transactions] = useState(initialTransactions);
  const [creditEntries, setCreditEntries] = useState(initialCreditEntries);
  const [payrollRecords, setPayrollRecords] = useState(initialPayrollRecords);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Toast ────────────────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Employees ────────────────────────────────────────────────────────────────
  const addEmployee = useCallback((data) => {
    const newEmp = { ...data, id: Date.now(), status: 'Active' };
    setEmployees(prev => [newEmp, ...prev]);
    showToast(`Employee "${data.name}" added successfully!`);
  }, [showToast]);

  const updateEmployee = useCallback((id, data) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    showToast('Employee updated successfully!');
  }, [showToast]);

  const deleteEmployee = useCallback((id) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    showToast('Employee removed.', 'info');
  }, [showToast]);

  // ── Expenses ─────────────────────────────────────────────────────────────────
  const addExpense = useCallback((data) => {
    const newExp = { ...data, id: Date.now(), date: new Date().toISOString().split('T')[0], status: 'Pending' };
    setExpenses(prev => [newExp, ...prev]);
    showToast('Expense submitted for approval!');
  }, [showToast]);

  const approveExpense = useCallback((id) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'Approved' } : e));
    showToast('Expense Approved!', 'success');
  }, [showToast]);

  const rejectExpense = useCallback((id, reason) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'Rejected', rejectReason: reason } : e));
    showToast('Expense Rejected.', 'error');
  }, [showToast]);

  // ── Credit Journal ────────────────────────────────────────────────────────────
  const addCreditEntry = useCallback((data) => {
    const newEntry = { ...data, id: Date.now(), status: 'Pending' };
    setCreditEntries(prev => [newEntry, ...prev]);
    showToast('Credit entry added!');
  }, [showToast]);

  const updateCreditEntry = useCallback((id, data) => {
    setCreditEntries(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    showToast('Credit entry updated!');
  }, [showToast]);

  const markCreditPaid = useCallback((id) => {
    setCreditEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'Paid' } : e));
    showToast('Marked as Paid!', 'success');
  }, [showToast]);

  // ── Payroll ───────────────────────────────────────────────────────────────────
  const addPayrollRecord = useCallback((data) => {
    const newRecord = { ...data, id: Date.now() };
    setPayrollRecords(prev => [newRecord, ...prev]);
    showToast('Payroll record added!');
  }, [showToast]);

  const markPayrollPaid = useCallback((id) => {
    setPayrollRecords(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'Paid', paidOn: new Date().toISOString().split('T')[0] } : r
    ));
    showToast('Salary marked as Paid!', 'success');
  }, [showToast]);

  // ── Global Search ─────────────────────────────────────────────────────────────
  const getSearchResults = useCallback((query) => {
    if (!query || query.trim().length < 2) return [];
    const q = query.toLowerCase();
    const results = [];

    employees.filter(e => e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q))
      .slice(0, 3).forEach(e => results.push({ type: 'Employee', label: e.name, sub: e.role, path: '/salary-payroll' }));

    expenses.filter(e => e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))
      .slice(0, 3).forEach(e => results.push({ type: 'Expense', label: e.description, sub: `PKR ${e.amount.toLocaleString()}`, path: '/expense-management' }));

    creditEntries.filter(c => c.customer.toLowerCase().includes(q))
      .slice(0, 2).forEach(c => results.push({ type: 'Credit', label: c.customer, sub: `PKR ${c.amount.toLocaleString()}`, path: '/credit-journal' }));

    transactions.filter(t => t.orderId.toLowerCase().includes(q) || t.staff.toLowerCase().includes(q))
      .slice(0, 2).forEach(t => results.push({ type: 'Transaction', label: t.orderId, sub: t.staff, path: '/reports-analytics' }));

    return results;
  }, [employees, expenses, creditEntries, transactions]);

  const value = {
    // Data
    employees, expenses, transactions, creditEntries, payrollRecords,
    // Employee
    addEmployee, updateEmployee, deleteEmployee,
    // Expenses
    addExpense, approveExpense, rejectExpense,
    // Credit
    addCreditEntry, updateCreditEntry, markCreditPaid,
    // Payroll
    addPayrollRecord, markPayrollPaid,
    // UI
    toast, showToast,
    searchQuery, setSearchQuery, getSearchResults,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
