import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Width = 'content' | 'prose' | 'shell';

const widths: Record<Width, string> = {
  content: 'max-w-[80rem]', // 1280 — the working grid
  prose: 'max-w-[44rem]', // ~68 characters of Latin text
  shell: 'max-w-[90rem]', // 1440 — full-bleed furniture
};

interface ContainerProps {
  children: ReactNode;
  width?: Width;
  as?: ElementType;
  className?: string;
}

/** Owns horizontal gutters. Nothing else in the system sets them. */
export function Container({
  children,
  width = 'content',
  as: Tag = 'div',
  className,
}: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-6 md:px-10', widths[width], className)}>
      {children}
    </Tag>
  );
}
