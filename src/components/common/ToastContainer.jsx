import React from 'react';
import { useApp } from '../../context/AppContext';

export const ToastContainer = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className="toast animate-fade">
          <span style={{ fontSize: '1.2rem' }}>{toast.icon}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
