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

import { useState, useRef, useEffect } from 'react'
import { RotateCcw, HelpCircle, Sun } from 'lucide-react'
import type { Model } from '@/lib/showroom-data'

const HDRI_OPTIONS = [
  { value: 'hdri/wooden_studio_08_4k.hdr', label: 'Estudio Madera' },
  { value: 'hdri/wooden_studio_17_4k.hdr', label: 'Estudio Madera 2' },
  { value: 'hdri/ferndale_studio_04_4k.hdr', label: 'Estudio Ferndale' },
  { value: 'hdri/german_town_street_4k.hdr', label: 'Calle Urbana' },
]

interface TopBarActionsProps {
  model: Model
  /** Called when user clicks "Recentrar" to reset 3D camera */
  onRecenter?: () => void
  /** Current environment image */
  environmentImage?: string
  /** Callback to change environment image */
  onEnvironmentChange?: (hdri: string) => void
}

export function TopBarActions({ model, onRecenter, environmentImage, onEnvironmentChange }: TopBarActionsProps) {
  const [hdriOpen, setHdriOpen] = useState(false)
  const hdriRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!hdriOpen) return
    function handleClick(e: MouseEvent) {
      if (hdriRef.current && !hdriRef.current.contains(e.target as Node)) {
        setHdriOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [hdriOpen])

  return (
    <div className="flex items-center justify-between px-4 py-3 lg:px-6">
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
        {/* HDRI selector */}
        <div ref={hdriRef} className="relative">
          <button
            type="button"
            className="glass-panel flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Cambiar iluminación"
            aria-expanded={hdriOpen}
            onClick={() => setHdriOpen((v) => !v)}
          >
            <Sun className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Entorno</span>
          </button>
          {hdriOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-48 rounded-lg border border-border bg-[var(--bg-surface)] p-1 shadow-lg">
              {HDRI_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onEnvironmentChange?.(opt.value)
                    setHdriOpen(false)
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors ${
                    environmentImage === opt.value
                      ? 'bg-primary/15 text-primary font-medium'
                      : 'text-secondary-foreground hover:bg-muted'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      environmentImage === opt.value ? 'bg-primary' : 'bg-transparent'
                    }`}
                  />
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="glass-panel flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Recentrar vista del modelo 3D"
          onClick={() => onRecenter?.()}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Recentrar</span>
        </button>

      </div>
    </div>
  )
}
