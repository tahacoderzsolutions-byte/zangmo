import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import OwnerDashboard from './pages/OwnerDashboard';
import ReportsAnalytics from './pages/ReportsAnalytics';
import BranchReports from './pages/BranchReports';
import SalaryPayroll from './pages/SalaryPayroll';
import CreditJournal from './pages/CreditJournal';
import ExpenseManagement from './pages/ExpenseManagement';
import ExpenseApproval from './pages/ExpenseApproval';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<OwnerDashboard />} />
            <Route path="reports-analytics" element={<ReportsAnalytics />} />
            <Route path="branch-reports" element={<BranchReports />} />
            <Route path="salary-payroll" element={<SalaryPayroll />} />
            <Route path="credit-journal" element={<CreditJournal />} />
            <Route path="expense-management" element={<ExpenseManagement />} />
            <Route path="expense-approval" element={<ExpenseApproval />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
