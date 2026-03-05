// ===================== COMPONENT: TopBarActions =====================
/**
 * Top bar overlay on the stage area.
 * Shows model name, Recenter and Help buttons.
 *
 * Props:
 * - model: Current car model for name/badge display.
 * - onRecenter: Callback to reset the 3D camera to its initial position.
 */

'use client'

import { RotateCcw, HelpCircle } from 'lucide-react'
import type { Model } from '@/lib/showroom-data'

interface TopBarActionsProps {
  model: Model
  /** Called when user clicks "Recentrar" to reset 3D camera */
  onRecenter?: () => void
}

export function TopBarActions({ model, onRecenter }: TopBarActionsProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 md:px-6">
      {/* Model name + badge */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-foreground tracking-tight text-balance">
          {model.name}
        </h1>
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${model.badgeColor}`}
        >
          {model.badge}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="glass-panel flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Recentrar vista del modelo 3D"
          onClick={() => onRecenter?.()}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Recentrar</span>
        </button>
        <button
          type="button"
          className="glass-panel flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Mostrar ayuda de controles"
          onClick={() => {
            /* Placeholder: show help modal */
          }}
        >
          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Ayuda</span>
        </button>
      </div>
    </div>
  )
}
