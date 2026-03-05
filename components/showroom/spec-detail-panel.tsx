// ===================== COMPONENT: SpecDetailPanel =====================
/**
 * Detail panel for a selected spec/hotspot.
 * - Desktop: Appears as a right-side panel.
 * - Mobile: Appears as a bottom sheet (using vaul Drawer).
 *
 * Includes: title, description, 3 bullet points, and "Marcar como visto" button.
 *
 * Accessibility:
 * - aria-label on close button for screen readers.
 * - Semantic list for bullet points.
 * - Focus trap via Drawer on mobile.
 */

'use client'

import { X, CheckCircle, Battery, Shield, Wifi, Cpu, Map, Camera, Lightbulb } from 'lucide-react'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import type { Spec, Model } from '@/lib/showroom-data'
import { useIsMobile } from '@/hooks/use-mobile'

const ICON_MAP: Record<string, React.ElementType> = {
  battery: Battery,
  shield: Shield,
  wifi: Wifi,
  cpu: Cpu,
  map: Map,
  camera: Camera,
  lightbulb: Lightbulb,
}

interface SpecDetailPanelProps {
  spec: Spec | null
  model: Model
  isOpen: boolean
  isDiscovered: boolean
  onClose: () => void
  onMarkDiscovered: () => void
}

export function SpecDetailPanel({
  spec,
  model,
  isOpen,
  isDiscovered,
  onClose,
  onMarkDiscovered,
}: SpecDetailPanelProps) {
  const isMobile = useIsMobile()

  if (!spec) return null

  const Icon = ICON_MAP[spec.icon] ?? Battery

  const content = (
    <div className="flex flex-col gap-5 p-5 lg:p-6">
      {/* Header with icon and title */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `color-mix(in srgb, ${model.accentColor} 15%, transparent)`,
              border: `1px solid color-mix(in srgb, ${model.accentColor} 30%, transparent)`,
            }}
          >
            <Icon className="h-5 w-5" style={{ color: model.accentColor }} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground leading-tight">{spec.title}</h2>
            <span className="text-xs text-muted-foreground">{spec.label}</span>
          </div>
        </div>
        {!isMobile && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Cerrar panel de detalles"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-muted-foreground">{spec.description}</p>

      {/* Bullet points */}
      <ul className="flex flex-col gap-2.5" role="list" aria-label="Caracteristicas destacadas">
        {spec.bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: model.accentColor }}
              aria-hidden="true"
            />
            {bullet}
          </li>
        ))}
      </ul>

      {/* Mark as discovered button */}
      <button
        type="button"
        onClick={() => {
          onMarkDiscovered()
        }}
        disabled={isDiscovered}
        className={`
          mt-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium
          transition-all duration-200
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
          ${
            isDiscovered
              ? 'bg-secondary text-muted-foreground cursor-default'
              : 'text-primary-foreground hover:opacity-90 active:scale-[0.98]'
          }
        `}
        style={
          !isDiscovered ? { backgroundColor: model.accentColor } : undefined
        }
        aria-label={isDiscovered ? 'Ya marcado como visto' : 'Marcar esta caracteristica como vista'}
      >
        <CheckCircle className="h-4 w-4" aria-hidden="true" />
        {isDiscovered ? 'Ya descubierto' : 'Marcar como visto'}
      </button>
    </div>
  )

  // Mobile: bottom sheet via vaul Drawer
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="bg-card border-border">
          {content}
        </DrawerContent>
      </Drawer>
    )
  }

  // Desktop: right-side panel with slide-in animation
  return (
    <aside
      className={`
        w-[340px] shrink-0 glass-panel rounded-2xl overflow-hidden showroom-scroll overflow-y-auto
        transition-all duration-300 ease-out
        ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
      `}
      role="complementary"
      aria-label="Panel de detalles de la caracteristica"
    >
      {content}
    </aside>
  )
}
