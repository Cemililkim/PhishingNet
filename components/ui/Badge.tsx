import { HTMLAttributes } from 'react';
import { Check, X, AlertTriangle, Circle } from 'lucide-react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'pass' | 'fail' | 'warning' | 'neutral';
    size?: 'sm' | 'md';
    children: React.ReactNode;
}

const icons = {
    pass: Check,
    fail: X,
    warning: AlertTriangle,
    neutral: Circle,
};

export default function Badge({
    className = '',
    variant = 'neutral',
    size = 'md',
    children,
    ...props
}: BadgeProps) {
    const Icon = icons[variant];

    const variants = {
        pass: `
      bg-[var(--success-50)] text-[var(--success-700)]
      border-[var(--success-200)]
    `,
        fail: `
      bg-[var(--danger-50)] text-[var(--danger-700)]
      border-[var(--danger-200)]
    `,
        warning: `
      bg-[var(--warning-50)] text-[var(--warning-700)]
      border-[var(--warning-200)]
    `,
        neutral: `
      bg-[var(--gray-100)] text-[var(--gray-600)]
      border-[var(--gray-200)]
    `,
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs gap-1',
        md: 'px-3 py-1 text-sm gap-1.5',
    };

    return (
        <span
            className={`
        inline-flex items-center
        font-[var(--font-medium)]
        border rounded-[var(--radius-full)]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            {...props}
        >
            <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
            {children}
        </span>
    );
}
