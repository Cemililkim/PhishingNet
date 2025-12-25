import { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'safe' | 'warning' | 'danger';
    children: ReactNode;
}

export default function Card({
    className = '',
    variant = 'default',
    children,
    ...props
}: CardProps) {
    const baseStyles = `
    bg-[var(--bg-secondary)]
    border rounded-[var(--radius-lg)]
    p-[var(--space-6)]
    transition-all duration-[var(--duration-fast)]
  `;

    const variants = {
        default: `
      border-[var(--border-default)]
      shadow-[var(--shadow-sm)]
    `,
        safe: `
      border-2 border-[var(--success-500)]
      shadow-[var(--shadow-success)]
    `,
        warning: `
      border-2 border-[var(--warning-500)]
      shadow-[var(--shadow-warning)]
    `,
        danger: `
      border-2 border-[var(--danger-500)]
      shadow-[var(--shadow-danger)]
    `,
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </div>
    );
}

// Card sub-components
export function CardHeader({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`mb-[var(--space-4)] pb-[var(--space-4)] border-b border-[var(--border-default)] ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardTitle({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={`text-[var(--text-xl)] font-[var(--font-semibold)] text-[var(--text-primary)] ${className}`}
            {...props}
        >
            {children}
        </h3>
    );
}

export function CardContent({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`text-[var(--text-secondary)] ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`mt-[var(--space-4)] pt-[var(--space-4)] border-t border-[var(--border-default)] flex justify-end gap-[var(--space-3)] ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
