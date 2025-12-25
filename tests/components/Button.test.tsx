import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/ui/Button';

describe('Button', () => {
    describe('rendering', () => {
        it('renders children correctly', () => {
            render(<Button>Click me</Button>);
            expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
        });

        it('renders with default primary variant', () => {
            render(<Button>Primary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-[var(--primary-500)]');
        });

        it('renders different variants', () => {
            const { rerender } = render(<Button variant="danger">Danger</Button>);
            expect(screen.getByRole('button')).toHaveClass('bg-[var(--danger-500)]');

            rerender(<Button variant="success">Success</Button>);
            expect(screen.getByRole('button')).toHaveClass('bg-[var(--success-500)]');

            rerender(<Button variant="secondary">Secondary</Button>);
            expect(screen.getByRole('button')).toHaveClass('border-[var(--primary-500)]');

            rerender(<Button variant="ghost">Ghost</Button>);
            expect(screen.getByRole('button')).toHaveClass('bg-transparent');
        });

        it('renders different sizes', () => {
            const { rerender } = render(<Button size="sm">Small</Button>);
            expect(screen.getByRole('button')).toHaveClass('h-8');

            rerender(<Button size="md">Medium</Button>);
            expect(screen.getByRole('button')).toHaveClass('h-10');

            rerender(<Button size="lg">Large</Button>);
            expect(screen.getByRole('button')).toHaveClass('h-12');
        });
    });

    describe('states', () => {
        it('shows loading state', () => {
            render(<Button isLoading>Loading</Button>);
            expect(screen.getByRole('button')).toBeDisabled();
            expect(screen.getByText(/loading/i)).toBeInTheDocument();
        });

        it('can be disabled', () => {
            render(<Button disabled>Disabled</Button>);
            expect(screen.getByRole('button')).toBeDisabled();
        });
    });

    describe('interactions', () => {
        it('calls onClick when clicked', async () => {
            const user = userEvent.setup();
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click</Button>);

            await user.click(screen.getByRole('button'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('does not call onClick when disabled', async () => {
            const user = userEvent.setup();
            const handleClick = jest.fn();
            render(<Button onClick={handleClick} disabled>Click</Button>);

            await user.click(screen.getByRole('button'));
            expect(handleClick).not.toHaveBeenCalled();
        });
    });
});
