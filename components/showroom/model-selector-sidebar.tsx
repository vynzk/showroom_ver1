// ===================== COMPONENT: ModelSelectorSidebar (Desktop) =====================
/**
 * Fixed left sidebar visible only on desktop (md+).
 * Shows car model cards for selection.
 * Each card displays name, badge, and brief description.
 */

'use client'

import { Car } from 'lucide-react'
import { MODELS } from '@/lib/showroom-data'
import type { Model } from '@/lib/showroom-data'

interface ModelSelectorSidebarProps {
  selectedModelId: string
  onSelectModel: (modelId: string) => void
}

export function ModelSelectorSidebar({ selectedModelId, onSelectModel }: ModelSelectorSidebarProps) {
  return (
    <aside
      className="hidden md:flex w-[240px] shrink-0 flex-col gap-4 p-4"
      role="navigation"
      aria-label="Selector de modelos"
    >
      {/* Brand logo area */}
      <div className="flex items-center gap-2.5 px-2 pb-2">
        {/* logo png */}
        <img src="/logoDongfeng.png" alt="Showroom 3D" className="h-4" />
      </div>

      {/* Model cards */}
      <div className="flex flex-col gap-2.5">
        <span className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Modelos
        </span>
        {MODELS.map((model: Model) => {
          const isSelected = model.id === selectedModelId
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onSelectModel(model.id)}
              className={`
                group relative flex flex-col gap-2 rounded-xl p-3 text-left
                transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                ${
                  isSelected
                    ? 'glass-panel ring-1'
                    : 'hover:bg-secondary/50'
                }
              `}
              style={
                isSelected
                  ? { borderColor: `color-mix(in srgb, ${model.accentColor} 40%, transparent)` }
                  : undefined
              }
              aria-pressed={isSelected}
              aria-label={`Seleccionar ${model.name}`}
            >
              {/* Card header */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold ${
                    isSelected ? model.accentClass : 'text-foreground'
                  }`}
                >
                  {model.name}
                </span>
                <span
                  className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${model.badgeColor}`}
                >
                  {model.badge}
                </span>
              </div>
              {/* Card description */}
              <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {model.description}
              </p>
              {/* Active indicator */}
              {isSelected && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r-full"
                  style={{ backgroundColor: model.accentColor }}
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
