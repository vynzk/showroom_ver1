// ===================== COMPONENT: ModelSelectorDrawer (Mobile) =====================
/**
 * Mobile-only bottom sheet drawer for selecting car models.
 * Uses vaul Drawer component for smooth gesture-based interaction.
 * Triggered by a floating action button visible only on mobile.
 *
 * Accessibility:
 * - Drawer provides focus trap automatically.
 * - Button has aria-label for screen readers.
 */

'use client'

import { Car, ChevronUp } from 'lucide-react'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { MODELS } from '@/lib/showroom-data'
import type { Model } from '@/lib/showroom-data'

interface ModelSelectorDrawerProps {
  selectedModelId: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSelectModel: (modelId: string) => void
}

export function ModelSelectorDrawer({
  selectedModelId,
  isOpen,
  onOpenChange,
  onSelectModel,
}: ModelSelectorDrawerProps) {
  return (
    <div className="md:hidden">
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <button
            type="button"
            className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Abrir selector de modelos"
          >
            <Car className="h-5 w-5" aria-hidden="true" />
            <ChevronUp className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          </button>
        </DrawerTrigger>
        <DrawerContent className="bg-card border-border">
          <div className="flex flex-col gap-3 p-5 pb-8">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Seleccionar Modelo
            </span>
            {MODELS.map((model: Model) => {
              const isSelected = model.id === selectedModelId
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => onSelectModel(model.id)}
                  className={`
                    flex items-center gap-3 rounded-xl p-3.5 text-left
                    transition-all duration-200
                    focus-visible:ring-2 focus-visible:ring-ring
                    ${isSelected ? 'glass-panel' : 'hover:bg-secondary/50'}
                  `}
                  style={
                    isSelected
                      ? { borderColor: `color-mix(in srgb, ${model.accentColor} 40%, transparent)` }
                      : undefined
                  }
                  aria-pressed={isSelected}
                  aria-label={`Seleccionar ${model.name}`}
                >
                  {/* Accent dot */}
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: model.accentColor }}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${isSelected ? model.accentClass : 'text-foreground'}`}>
                        {model.name}
                      </span>
                      <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${model.badgeColor}`}>
                        {model.badge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{model.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
