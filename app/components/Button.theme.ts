import { tv, type VariantProps } from 'tailwind-variants';

export const buttonTheme = tv(
  {
    base: [
      'flex',
      'leading-none',
      'text-center',
      'justify-center',
      'items-center',
      'font-medium',
      'rounded-full',
      'focus-ring',
      'transition-all',
      'duration-300',
      'font-mono',
      'uppercase',
      'active:scale-95',
    ],
    variants: {
      variant: {
        primary: [
          'bg-brand-primary',
          'hover:bg-brand-primary-hovered',
          'text-base-950',
          'focus-ring-primary',
        ],
        secondary: [
          'bg-base-950',
          'border border-base-700',
          'text-base-300',
          'hover:text-base-200',
          'hover:border-base-500',
          'focus-ring-secondary',
        ],
        tertiary: [
          'bg-base-bg-alt',
          'border border-base-700',
          'text-base-950',
          'hover:bg-base-bg-alt',
          'focus-ring-tertiary',
        ],
        unstyled: [
          'bg-transparent',
          'border-none',
          'text-base-bg-alt',
          'hover:text-base-bg-alt/80',
          'focus-ring-none',
        ],
      },
      size: {
        lg: [
          'h-14 sm:h-[6.0625rem]',
          '[--height-value:3.5rem]',
          'px-5 py-2',
          'gap-4',
          'tracking-[.07rem]',
          'text-xs leading-5',
        ],
        md: [
          'h-12',
          '[--height-value:calc(var(--spacing)*12)]',
          'px-6 py-4',
          'gap-4',
          'tracking-[.06rem]',
          'text-xs leading-5',
        ],
        sm: [
          'h-9',
          '[--height-value:calc(var(--spacing)*9)]',
          'px-4 py-2.5',
          'gap-2',
          'tracking-[.05rem]',
          'text-2xs leading-5',
        ],
        xs: [
          'h-8',
          '[--height-value:calc(var(--spacing)*8)]',
          'px-4 py-2',
          'gap-2',
          'tracking-[.05rem]',
          'text-2xs leading-5',
        ],
        xxs: [
          'h-5',
          '[--height-value:calc(var(--spacing)*5)]',
          'gap-3',
          'tracking-[.05rem]',
          'text-2xs leading-5',
        ],
      },
      disable: {
        true: ['cursor-not-allowed', 'opacity-50'],
      },
      iconOnly: {
        true: ['px-0 py-0', 'w-[var(--height-value)]'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
  {
    twMerge: true,
  },
); 