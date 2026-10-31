import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/95 text-emerald-950',
    error: 'border-rose-200 bg-rose-50/95 text-rose-950',
    warning: 'border-amber-200 bg-amber-50/95 text-amber-950',
    info: 'border-sky-200 bg-sky-50/95 text-sky-950'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-3 duration-300 pointer-events-auto">
      <div className={`p-4 rounded-2xl border shadow-xl backdrop-blur-md flex items-start gap-3 ${borders[toast.type]}`}>
        {icons[toast.type]}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold font-heading">{toast.title}</h4>
          <p className="text-[11px] mt-0.5 leading-relaxed opacity-90">{toast.message}</p>
        </div>
      </div>
    </div>
  );
};
