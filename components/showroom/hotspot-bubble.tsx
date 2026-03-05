// ===================== COMPONENT: HotspotBubble =====================
/**
 * Individual floating hotspot bubble over the 3D stage.
 *
 * States:
 * - normal: Default state, floating animation with subtle glow.
 * - active: Currently selected, brighter glow and ring.
 * - discovered: Already viewed, dimmed with checkmark.
 *
 * Accessibility: aria-label describes the hotspot's purpose.
 * Focus: focus-visible ring for keyboard navigation.
 *
 * HOW TO CHANGE HOTSPOT POSITIONS:
 * Edit the `position` field in each Spec object in showroom-data.ts.
 * Values are CSS percentages relative to the stage container.
 */

'use client'

import {
  Battery,
  Shield,
  Wifi,
  Cpu,
  Map,
  Camera,
  Lightbulb,
  Check,
} from 'lucide-react'

import type { Spec } from '@/lib/showroom-data'

const FLOAT_DELAYS = [
  'animate-float',
  'animate-float-delay-1',
  'animate-float-delay-2',
  'animate-float-delay-3',
  'animate-float-delay-4',
]

const ICON_MAP: Record<string, React.ElementType> = {
  battery: Battery,
  shield: Shield,
  wifi: Wifi,
  cpu: Cpu,
  map: Map,
  camera: Camera,
  lightbulb: Lightbulb,
}

interface HotspotBubbleProps {
  spec: Spec
  index: number
  isActive: boolean
  isDiscovered: boolean
  accentColor: string
  glowClass: string
  onClick: () => void
}

export function HotspotBubble({
  spec,
  index,
  isActive,
  isDiscovered,
  accentColor,
  glowClass,
  onClick,
}: HotspotBubbleProps) {
  const Icon = ICON_MAP[spec.icon] ?? Battery
  const floatClass = FLOAT_DELAYS[index % FLOAT_DELAYS.length]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        absolute z-10 flex h-10 w-10 items-center justify-center rounded-full
        transition-all duration-250 ease-out
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${floatClass}
        ${
          isActive
            ? 'scale-110 ring-2 ring-offset-2 ring-offset-background'
            : isDiscovered
              ? 'opacity-60 hover:opacity-90'
              : 'hover:scale-105'
        }
        ${!isActive && !isDiscovered ? glowClass : ''}
      `}
      style={{
        top: spec.position.top,
        left: spec.position.left,
        backgroundColor: isDiscovered ? 'var(--secondary)' : `color-mix(in srgb, ${accentColor} 25%, transparent)`,
        borderColor: isActive ? accentColor : isDiscovered ? 'var(--border)' : `color-mix(in srgb, ${accentColor} 40%, transparent)`,
        borderWidth: '1.5px',
        ...(isActive ? { ringColor: accentColor } : {}),
      }}
      aria-label={`${isDiscovered ? 'Ya descubierto: ' : 'Explorar: '}${spec.label}`}
      aria-pressed={isActive}
    >
      {isDiscovered && !isActive ? (
        <Check className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      ) : (
        <Icon
          className="h-4 w-4"
          style={{ color: isActive ? accentColor : isDiscovered ? 'var(--muted-foreground)' : accentColor }}
          aria-hidden="true"
        />
      )}
    </button>
  )
}
