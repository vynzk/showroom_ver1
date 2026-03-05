// ===================== COMPONENT: ShowroomStage =====================
/**
 * Central 3D viewer container with:
 * - TopBarActions overlay (model name, Recenter, Help)
 * - ModelViewerStage: Real <model-viewer> 3D rendering with hotspots
 * - Zoom controls overlay (zoom in, zoom out, recenter)
 * - Footer tip text
 *
 * The 3D model is loaded from /public/{modelId}.glb.
 * Hotspot positions are defined in showroom-data.ts (hotspotPosition, hotspotNormal).
 *
 * HOW TO ADJUST HOTSPOT POSITIONS:
 *   1. Open https://modelviewer.dev/editor/
 *   2. Load your GLB file, add annotation points
 *   3. Copy data-position and data-normal values
 *   4. Paste into hotspotPosition / hotspotNormal in lib/showroom-data.ts
 */

'use client'

import { useRef, useMemo } from 'react'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import type { Model, Spec } from '@/lib/showroom-data'
import { TopBarActions } from './top-bar-actions'
import { ModelViewerStage, type ModelViewerStageRef, type ModelViewerHotspot } from './model-viewer-stage'

// ===================== MODEL FILE MAPPING =====================
/**
 * Maps model IDs to their GLB file paths in /public.
 * Add new entries here when adding more car models.
 */
const MODEL_SRC_MAP: Record<string, string> = {
  nammi: '/Nammi_01_2023.glb',
  // vigo: '/Vigo.glb',
}

interface ShowroomStageProps {
  model: Model
  specs: Spec[]
  activeSpecId: string | null
  isDiscovered: (specId: string) => boolean
  onSelectSpec: (specId: string) => void
  environmentImage: string
  onEnvironmentChange: (hdri: string) => void
  onInteraction?: (type: 'rotate' | 'zoom') => void
}

export function ShowroomStage({
  model,
  specs,
  activeSpecId,
  isDiscovered,
  onSelectSpec,
  environmentImage,
  onEnvironmentChange,
  onInteraction,
}: ShowroomStageProps) {
  const viewerRef = useRef<ModelViewerStageRef>(null)

  // ===================== HOTSPOT DATA TRANSFORM =====================
  // Convert Spec[] to ModelViewerHotspot[] for the 3D viewer
  const hotspots: ModelViewerHotspot[] = useMemo(
    () =>
      specs.map((spec) => ({
        id: spec.id,
        label: spec.label,
        icon: spec.icon,
        position: spec.hotspotPosition,
        normal: spec.hotspotNormal,
      })),
    [specs]
  )

  // ===================== MODEL SOURCE =====================
  const modelSrc = MODEL_SRC_MAP[model.id] ?? MODEL_SRC_MAP.nammi

  return (
    <div className="relative flex flex-col flex-1 min-h-0 overflow-hidden rounded-2xl glass-panel">
      {/* Top bar with model name and actions */}
      <TopBarActions
        model={model}
        onRecenter={() => viewerRef.current?.resetView()}
        environmentImage={environmentImage}
        onEnvironmentChange={onEnvironmentChange}
      />

      {/* ===================== 3D STAGE ===================== */}
      <div className="relative flex-1 min-h-[300px] md:min-h-[400px]">
        {/* Green haze glow behind the 3D model */}
        <div
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="h-[60%] w-[50%] rounded-full bg-[#B8FF3D]/15 blur-[120px]" />
        </div>
        <ModelViewerStage
          ref={viewerRef}
          modelSrc={modelSrc}
          alt={`Modelo 3D - ${model.name}`}
          environmentImage={environmentImage}
          hotspots={hotspots}
          activeHotspotId={activeSpecId}
          isDiscovered={isDiscovered}
          accentColor={model.accentColor}
          glowClass={model.glowClass}
          onHotspotClick={onSelectSpec}
          onCameraChange={() => onInteraction?.('rotate')}
          onZoom={() => onInteraction?.('zoom')}
        />
      </div>

      {/* ===================== ZOOM CONTROLS ===================== */}
      <div className="absolute bottom-14 right-4 flex flex-col gap-1.5 z-20">
        <button
          type="button"
          onClick={() => { viewerRef.current?.zoomIn(); onInteraction?.('zoom') }}
          className="glass-panel flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Acercar zoom"
        >
          <ZoomIn className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => { viewerRef.current?.zoomOut(); onInteraction?.('zoom') }}
          className="glass-panel flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Alejar zoom"
        >
          <ZoomOut className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => viewerRef.current?.resetView()}
          className="glass-panel flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Restablecer vista"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Footer tip */}
      <div className="flex items-center justify-center px-4 py-3 text-[11px] text-muted-foreground/50 tracking-wide select-none">
        <span>Arrastra para rotar &middot; Pellizca para zoom</span>
      </div>
    </div>
  )
}
