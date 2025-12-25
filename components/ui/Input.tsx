import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, hint, icon, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        const baseStyles = `
      w-full h-11 px-[var(--space-4)]
      bg-[var(--bg-secondary)]
      border rounded-[var(--radius-md)]
      text-[var(--text-primary)] text-base
      placeholder:text-[var(--text-muted)]
      transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]
      focus:outline-none
    `;

        const stateStyles = error
            ? `
          border-[var(--danger-500)]
          focus:border-[var(--danger-500)]
          focus:ring-2 focus:ring-[var(--danger-500)] focus:ring-opacity-20
        `
            : `
          border-[var(--border-default)]
          focus:border-[var(--primary-500)]
          focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-opacity-20
        `;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block mb-[var(--space-2)] text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--text-primary)]"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-[var(--space-3)] top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={`${baseStyles} ${stateStyles} ${icon ? 'pl-10' : ''} ${className}`}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-[var(--space-1)] text-[var(--text-sm)] text-[var(--danger-600)]">
                        ⚠ {error}
                    </p>
                )}
                {hint && !error && (
                    <p className="mt-[var(--space-1)] text-[var(--text-sm)] text-[var(--text-muted)]">
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
