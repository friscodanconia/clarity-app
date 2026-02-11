interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
}

const variants = {
  default: 'bg-stone-100 text-stone-600',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
