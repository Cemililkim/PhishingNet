import { forwardRef, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
        const baseStyles = `
      inline-flex items-center justify-center font-medium
      transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]
      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-500)]
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

        const variants = {
            primary: `
        bg-[var(--primary-500)] text-white
        hover:bg-[var(--primary-600)] hover:-translate-y-0.5
        active:translate-y-0
        shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-primary)]
      `,
            secondary: `
        bg-transparent text-[var(--primary-500)]
        border border-[var(--primary-500)]
        hover:bg-[var(--primary-50)]
      `,
            ghost: `
        bg-transparent text-[var(--text-secondary)]
        hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]
      `,
            danger: `
        bg-[var(--danger-500)] text-white
        hover:bg-[var(--danger-600)] hover:-translate-y-0.5
        active:translate-y-0
        shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-danger)]
      `,
            success: `
        bg-[var(--success-500)] text-white
        hover:bg-[var(--success-600)] hover:-translate-y-0.5
        active:translate-y-0
        shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-success)]
      `,
        };

        const sizes = {
            sm: 'h-8 px-3 text-sm rounded-[var(--radius-md)]',
            md: 'h-10 px-5 text-base rounded-[var(--radius-md)]',
            lg: 'h-12 px-6 text-base rounded-[var(--radius-lg)]',
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Loading...
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
