import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'bg-stone-800 text-stone-50 hover:bg-stone-700 active:bg-stone-900',
  secondary: 'bg-stone-200 text-stone-800 hover:bg-stone-300 active:bg-stone-400',
  ghost: 'text-stone-600 hover:bg-stone-100 active:bg-stone-200',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-lg font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
