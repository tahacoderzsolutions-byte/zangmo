import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const styles = {
    success: 'border-l-4 border-[#2e7d32] bg-surface-container-lowest',
    error:   'border-l-4 border-error bg-surface-container-lowest',
    info:    'border-l-4 border-primary bg-surface-container-lowest',
  };
  const icons = { success: 'check_circle', error: 'cancel', info: 'info' };
  const iconColors = { success: 'text-[#2e7d32]', error: 'text-error', info: 'text-primary' };

  return (
    <div className="fixed top-5 right-5 z-[200] animate-in slide-in-from-right">
      <div className={`${styles[toast.type]} flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl min-w-[280px]`}>
        <span className={`material-symbols-outlined ${iconColors[toast.type]}`}>{icons[toast.type]}</span>
        <p className="font-label-md text-label-md text-on-surface">{toast.message}</p>
      </div>
    </div>
  );
}
