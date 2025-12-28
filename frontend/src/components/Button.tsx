import React from 'react';

type Variant = 'primary' | 'success' | 'danger' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm hover:from-blue-700 hover:to-blue-800',
  success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm hover:from-green-600 hover:to-green-700',
  danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm hover:from-red-700 hover:to-red-800',
  secondary: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:shadow-sm',
  ghost: 'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-sm md:text-base',
  lg: 'px-6 py-3 text-base md:text-lg',
};

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: ButtonProps) {
  const base = 'rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all';
  const cls = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
