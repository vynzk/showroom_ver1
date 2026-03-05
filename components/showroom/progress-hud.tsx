// ===================== COMPONENT: ProgressHUD =====================
/**
 * Displays the gamification discovery counter (e.g., 2/5)
 * with a visual progress bar. Color adapts to the selected model's accent.
 */

'use client'

import { CheckCircle } from 'lucide-react'

interface ProgressHUDProps {
  discovered: number
  total: number
  progressClass: string
  accentClass: string
}

export function ProgressHUD({ discovered, total, progressClass, accentClass }: ProgressHUDProps) {
  const percentage = total > 0 ? (discovered / total) * 100 : 0
  const isComplete = discovered === total

  return (
    <div className="glass-panel flex items-center gap-3 rounded-xl px-4 py-2.5">
      <CheckCircle className={`h-4 w-4 ${accentClass} shrink-0`} aria-hidden="true" />
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-foreground">
            {isComplete ? 'Completo' : 'Descubrimientos'}
          </span>
          <span className={`text-xs font-bold tabular-nums ${accentClass}`}>
            {discovered}/{total}
          </span>
        </div>
        {/* Progress bar track */}
        <div
          className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden"
          role="progressbar"
          aria-valuenow={discovered}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${discovered} de ${total} caracteristicas descubiertas`}
        >
          {/* Progress bar fill */}
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${progressClass}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
