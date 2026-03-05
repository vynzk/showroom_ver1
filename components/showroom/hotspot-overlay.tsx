// ===================== COMPONENT: HotspotOverlay =====================
/**
 * Positions all 5 hotspot bubbles over the stage.
 * This is an absolute-positioned overlay covering the stage container.
 */

'use client'

import type { Spec, Model } from '@/lib/showroom-data'
import { HotspotBubble } from './hotspot-bubble'

interface HotspotOverlayProps {
  specs: Spec[]
  model: Model
  activeSpecId: string | null
  isDiscovered: (specId: string) => boolean
  onSelectSpec: (specId: string) => void
}

export function HotspotOverlay({
  specs,
  model,
  activeSpecId,
  isDiscovered,
  onSelectSpec,
}: HotspotOverlayProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-label="Puntos de interes del modelo"
      role="group"
    >
      {specs.map((spec, i) => (
        <div key={spec.id} className="pointer-events-auto">
          <HotspotBubble
            spec={spec}
            index={i}
            isActive={activeSpecId === spec.id}
            isDiscovered={isDiscovered(spec.id)}
            accentColor={model.accentColor}
            glowClass={model.glowClass}
            onClick={() => onSelectSpec(spec.id)}
          />
        </div>
      ))}
    </div>
  )
}
