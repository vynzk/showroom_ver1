// ===================== COMPONENT: OnboardingOverlay =====================
/**
 * Multi-step onboarding guide that introduces users to the showroom.
 * Shows animated hint cards with instructions on how to interact.
 * Dismisses permanently after completion or manual close.
 */

'use client'

import { useState } from 'react'
import {
  X,
  MousePointerClick,
  RotateCcw,
  Search,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Sun,
} from 'lucide-react'

interface OnboardingStep {
  icon: React.ElementType
  title: string
  description: string
}

const STEPS: OnboardingStep[] = [
  {
    icon: RotateCcw,
    title: 'Rota el modelo',
    description: 'Arrastra con el mouse o desliza con el dedo para rotar el vehículo y explorarlo desde cualquier ángulo.',
  },
  {
    icon: Search,
    title: 'Haz zoom',
    description: 'Usa la rueda del mouse o pellizca en pantalla táctil para acercar y alejar. También puedes usar los controles +/- a la derecha.',
  },
  {
    icon: MousePointerClick,
    title: 'Descubre las características',
    description: 'Haz clic en los puntos brillantes sobre el modelo para descubrir las especificaciones y características del vehículo.',
  },
  {
    icon: Sun,
    title: 'Cambia la iluminación',
    description: 'Usa el botón "Entorno" en la barra superior para cambiar la iluminación del escenario y ver el vehículo con distintas ambientaciones.',
  },
  {
    icon: CheckCircle,
    title: 'Completa el recorrido',
    description: 'Explora todos los hotspots y marca cada uno como "visto" para completar el recorrido. ¡Tu progreso se muestra arriba a la derecha!',
  },
]

interface OnboardingOverlayProps {
  onDismiss: () => void
}

export function OnboardingOverlay({ onDismiss }: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const step = STEPS[currentStep]
  const Icon = step.icon
  const isLast = currentStep === STEPS.length - 1
  const isFirst = currentStep === 0

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl border border-border bg-[var(--bg-surface)] p-6 shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Cerrar guía"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-6 bg-primary'
                  : i < currentStep
                    ? 'w-1.5 bg-primary/40'
                    : 'w-1.5 bg-muted-foreground/20'
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
          <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
        </div>

        {/* Navigation */}
        <div className="flex w-full items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={() => setCurrentStep((s) => s - 1)}
            disabled={isFirst}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Anterior
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={onDismiss}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              ¡Empezar!
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Siguiente
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
