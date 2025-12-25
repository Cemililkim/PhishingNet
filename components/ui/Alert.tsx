import { ReactNode, HTMLAttributes } from 'react';
import { Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'info' | 'success' | 'warning' | 'danger';
    title?: string;
    children: ReactNode;
}

const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    danger: AlertCircle,
};

export default function Alert({
    className = '',
    variant = 'info',
    title,
    children,
    ...props
}: AlertProps) {
    const Icon = icons[variant];

    const variants = {
        info: `
      bg-[var(--info-50)] border-l-[var(--info-500)]
      text-[var(--info-700)]
    `,
        success: `
      bg-[var(--success-50)] border-l-[var(--success-500)]
      text-[var(--success-700)]
    `,
        warning: `
      bg-[var(--warning-50)] border-l-[var(--warning-500)]
      text-[var(--warning-700)]
    `,
        danger: `
      bg-[var(--danger-50)] border-l-[var(--danger-500)]
      text-[var(--danger-700)]
    `,
    };

    return (
        <div
            role="alert"
            className={`
        p-[var(--space-4)]
        border-l-4 rounded-[var(--radius-md)]
        ${variants[variant]}
        ${className}
      `}
            {...props}
        >
            <div className="flex gap-[var(--space-3)]">
                <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                    {title && (
                        <h4 className="font-[var(--font-semibold)] mb-[var(--space-1)]">
                            {title}
                        </h4>
                    )}
                    <div className="text-[var(--text-sm)]">{children}</div>
                </div>
            </div>
        </div>
    );
}
