'use client';

import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { step: 1 as const, label: 'Capa' },
  { step: 2 as const, label: 'Miolo' },
  { step: 3 as const, label: 'Preview' },
  { step: 4 as const, label: 'Checkout' },
] as const;

export interface StepIndicatorProps {
  currentStep?: 1 | 2 | 3 | 4;
  className?: string;
}

export function StepIndicator({ currentStep = 1, className }: StepIndicatorProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-1 sm:gap-2 bg-white border-b px-4 py-2 shadow-sm',
        className
      )}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={4}
      aria-label={`Etapa ${currentStep} de 4: ${STEPS[currentStep - 1].label}`}
    >
      {STEPS.map(({ step, label }, index) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        const isPending = step > currentStep;

        return (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                isActive &&
                  'bg-primary text-primary-foreground ring-2 ring-primary/30',
                isCompleted && 'bg-muted text-muted-foreground',
                isPending && 'text-muted-foreground/60'
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4 shrink-0" aria-hidden />
              ) : (
                <Circle
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isActive && 'fill-current'
                  )}
                  aria-hidden
                />
              )}
              <span className="hidden sm:inline">{step}. {label}</span>
              <span className="sm:hidden">{step}</span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-0.5 h-px w-4 sm:w-8 shrink-0',
                  isCompleted ? 'bg-primary/40' : 'bg-border'
                )}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
