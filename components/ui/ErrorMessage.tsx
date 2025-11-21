import React from 'react';

interface ErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ children, className = '' }) => {
  if (!children) return null;
  
  return (
    <div className={`bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md ${className}`} role="alert">
      <p className="text-sm">{children}</p>
    </div>
  );
};
