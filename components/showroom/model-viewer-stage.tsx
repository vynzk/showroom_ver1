// ===================== COMPONENT: ModelViewerStage =====================
/**
 * @fileoverview
 * Encapsulates the <model-viewer> web component for 3D rendering.
 *
 * FEATURES:
 * - Loads a GLB model with configurable camera orbit, target, and limits.
 * - Renders hotspot slots as <button slot="hotspot-..."> inside model-viewer.
 * - Exposes imperative methods via ref: resetView(), zoomIn(), zoomOut().
 * - Emits onLoad and onHotspotClick callbacks.
 *
 * USAGE:
 *   <ModelViewerStage
 *     ref={viewerRef}
 *     modelSrc="/Nammi_01_2023.glb"
 *     hotspots={[{ id: 'autonomia', label: 'Batería', position: '0m 1m 0m', normal: '0m 1m 0m' }]}
 *     onHotspotClick={(specId) => openSpec(specId)}
 *     onLoad={() => console.log('Model loaded')}
 *   />
 *
 * HOW TO ADJUST HOTSPOT POSITIONS:
 *   1. Open https://modelviewer.dev/editor/ and load your GLB.
 *   2. Click "Add Hotspot" and position it on the model surface.
 *   3. Copy the `data-position` and `data-normal` values.
 *   4. Paste them into the `hotspotPosition` and `hotspotNormal` fields
 *      in each Spec entry in lib/showroom-data.ts.
 *
 * HOW TO CHANGE CAMERA DEFAULTS:
 *   Edit the DEFAULT_* constants below or pass custom props.
 */

'use client'

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState,
} from 'react'
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

// ===================== ICON MAP =====================
/** Maps icon string keys to Lucide icon components */
const ICON_MAP: Record<string, React.ElementType> = {
  battery: Battery,
  shield: Shield,
  wifi: Wifi,
  cpu: Cpu,
  map: Map,
  camera: Camera,
  lightbulb: Lightbulb,
}

// ===================== IMPORT MODEL-VIEWER (once) =====================
// Dynamic import to avoid SSR issues with the web component
let _modelViewerImported = false

// ===================== TYPES =====================

/** Hotspot data for positioning on the 3D model surface */
export interface ModelViewerHotspot {
  /** Unique ID matching a Spec id */
  id: string
  /** Display label for the hotspot annotation */
  label: string
  /** Icon key from ICON_MAP (e.g. 'battery', 'shield') */
  icon: string
  /** 3D position on model surface: "Xm Ym Zm" */
  position: string
  /** Surface normal direction: "Xm Ym Zm" */
  normal: string
}

/** Imperative methods exposed via ref */
export interface ModelViewerStageRef {
  /** Reset camera to initial orbit and target */
  resetView: () => void
  /** Zoom in by reducing field of view */
  zoomIn: () => void
  /** Zoom out by increasing field of view */
  zoomOut: () => void
}

interface ModelViewerStageProps {
  /** Path to the GLB model file (relative to /public) */
  modelSrc: string
  /** Alt text for the 3D model */
  alt?: string
  /** Optional poster image shown while loading */
  poster?: string
  /** Hotspot annotations to render on the model */
  hotspots: ModelViewerHotspot[]
  /** Active hotspot ID (for highlighting) */
  activeHotspotId?: string | null
  /** Whether a hotspot has been discovered */
  isDiscovered?: (specId: string) => boolean
  /** HDRI environment image path */
  environmentImage?: string
  /** Accent color for hotspot styling */
  accentColor?: string
  /** Glow animation class */
  glowClass?: string
  /** Callback when a hotspot is clicked */
  onHotspotClick?: (specId: string) => void
  /** Callback when camera is moved (rotate/pan) */
  onCameraChange?: () => void
  /** Callback when user zooms (wheel/pinch) */
  onZoom?: () => void
  /** Callback when model finishes loading */
  onLoad?: () => void

  // ===================== CAMERA CONFIGURATION =====================
  /** Initial camera orbit: "theta phi radius" (e.g. "0deg 75deg 4m") */
  initialCameraOrbit?: string
  /** Camera look-at target: "x y z" (e.g. "0m 0.5m 0m") */
  initialTarget?: string
  /** Minimum camera orbit limits */
  minOrbit?: string
  /** Maximum camera orbit limits */
  maxOrbit?: string
  /** Minimum field of view (closest zoom) */
  minFov?: string
  /** Maximum field of view (farthest zoom) */
  maxFov?: string
}

// ===================== CAMERA DEFAULTS =====================
/**
 * Default camera settings for the showroom.
 * Adjust these to match your specific 3D model's scale and orientation.
 *
 * - ORBIT: "horizontalAngle verticalAngle distance"
 * - TARGET: "x y z" point the camera looks at
 * - FOV: field of view angle (smaller = more zoomed in)
 */
const DEFAULT_CAMERA_ORBIT = '0deg 75deg 8m'
const DEFAULT_CAMERA_TARGET = '0m 0.3m 0m'
const DEFAULT_MIN_ORBIT = 'auto auto 4m'
const DEFAULT_MAX_ORBIT = 'auto auto 16m'
const DEFAULT_MIN_FOV = '20deg'
const DEFAULT_MAX_FOV = '45deg'

/** Zoom step in degrees for zoomIn/zoomOut buttons */
const ZOOM_STEP_DEG = 5

// ===================== COMPONENT =====================

export const ModelViewerStage = forwardRef<ModelViewerStageRef, ModelViewerStageProps>(
  function ModelViewerStage(
    {
      modelSrc,
      alt = 'Modelo 3D',
      poster,
      hotspots,
      activeHotspotId,
      isDiscovered,
      environmentImage = 'hdri/wooden_studio_08_4k.hdr',
      accentColor = '#B8FF3D',
      glowClass = '',
      onHotspotClick,
      onCameraChange,
      onZoom,
      onLoad,
      initialCameraOrbit = DEFAULT_CAMERA_ORBIT,
      initialTarget = DEFAULT_CAMERA_TARGET,
      minOrbit = DEFAULT_MIN_ORBIT,
      maxOrbit = DEFAULT_MAX_ORBIT,
      minFov = DEFAULT_MIN_FOV,
      maxFov = DEFAULT_MAX_FOV,
    },
    ref
  ) {
    const viewerRef = useRef<HTMLElement & Record<string, any>>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    // ===================== DYNAMIC IMPORT =====================
    // Import the model-viewer web component client-side only (no SSR)
    useEffect(() => {
      if (!_modelViewerImported) {
        _modelViewerImported = true
        import('@google/model-viewer')
      }
    }, [])

    // ===================== LOAD EVENT =====================
    useEffect(() => {
      const viewer = viewerRef.current
      if (!viewer) return

      const handleLoad = () => {
        setIsLoaded(true)
        onLoad?.()
      }

      viewer.addEventListener('load', handleLoad)
      return () => viewer.removeEventListener('load', handleLoad)
    }, [onLoad])

    // ===================== CAMERA CHANGE EVENT =====================
    useEffect(() => {
      const viewer = viewerRef.current
      if (!viewer || !onCameraChange) return

      const handleCameraChange = () => onCameraChange()
      viewer.addEventListener('camera-change', handleCameraChange, { once: true })
      return () => viewer.removeEventListener('camera-change', handleCameraChange)
    }, [onCameraChange])

    // ===================== ZOOM (WHEEL / PINCH) EVENT =====================
    useEffect(() => {
      const viewer = viewerRef.current
      if (!viewer || !onZoom) return

      const handleWheel = () => onZoom()
      viewer.addEventListener('wheel', handleWheel, { once: true, passive: true })

      // Detect pinch-to-zoom on touch devices (2+ fingers)
      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length >= 2) {
          onZoom()
          viewer.removeEventListener('touchmove', handleTouchMove)
        }
      }
      viewer.addEventListener('touchmove', handleTouchMove, { passive: true })

      return () => {
        viewer.removeEventListener('wheel', handleWheel)
        viewer.removeEventListener('touchmove', handleTouchMove)
      }
    }, [onZoom])

    // ===================== IMPERATIVE METHODS =====================

    /** Reset camera to initial position and orientation */
    const resetView = useCallback(() => {
      const viewer = viewerRef.current
      if (!viewer) return

      viewer.cameraOrbit = initialCameraOrbit
      viewer.cameraTarget = initialTarget

      // jumpCameraToGoal() snaps instantly without smooth interpolation
      if (typeof viewer.jumpCameraToGoal === 'function') {
        viewer.jumpCameraToGoal()
      }

      // Reset turntable rotation if auto-rotate was active
      if (typeof viewer.resetTurntableRotation === 'function') {
        viewer.resetTurntableRotation()
      }
    }, [initialCameraOrbit, initialTarget])

    /** Zoom in by reducing field of view */
    const zoomIn = useCallback(() => {
      const viewer = viewerRef.current
      if (!viewer) return

      const currentFov = viewer.getFieldOfView() // returns degrees
      const minFovNum = parseFloat(minFov)
      const newFov = Math.max(currentFov - ZOOM_STEP_DEG, minFovNum)
      viewer.fieldOfView = `${newFov}deg`
    }, [minFov])

    /** Zoom out by increasing field of view */
    const zoomOut = useCallback(() => {
      const viewer = viewerRef.current
      if (!viewer) return

      const currentFov = viewer.getFieldOfView()
      const maxFovNum = parseFloat(maxFov)
      const newFov = Math.min(currentFov + ZOOM_STEP_DEG, maxFovNum)
      viewer.fieldOfView = `${newFov}deg`
    }, [maxFov])

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({ resetView, zoomIn, zoomOut }), [
      resetView,
      zoomIn,
      zoomOut,
    ])

    // ===================== RENDER =====================
    return (
      <model-viewer
        ref={viewerRef as React.RefObject<any>}
        src={modelSrc}
        alt={alt}
        environment-image={environmentImage}
        poster={poster}
        camera-controls
        touch-action="none"
        interaction-prompt="none"
        shadow-intensity="5"
        exposure="3"
        shadow-softnesss="0.8"
        camera-orbit={initialCameraOrbit}
        camera-target={initialTarget}
        min-camera-orbit={minOrbit}
        max-camera-orbit={maxOrbit}
        min-field-of-view={minFov}
        max-field-of-view={maxFov}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          // Hide the default model-viewer progress bar
          ['--progress-bar-color' as string]: 'transparent',
        }}
      >
        {/* ===================== HOTSPOT SLOTS ===================== */}
        {/*
         * Each hotspot is a <button> with slot="hotspot-{id}".
         * model-viewer positions them on the 3D surface using
         * data-position and data-normal attributes.
         *
         * To reposition hotspots:
         * 1. Use https://modelviewer.dev/editor/
         * 2. Load your GLB, add annotations
         * 3. Copy data-position & data-normal values
         * 4. Update hotspotPosition/hotspotNormal in showroom-data.ts
         */}
        {hotspots.map((hotspot) => {
          const isActive = activeHotspotId === hotspot.id
          const discovered = isDiscovered?.(hotspot.id) ?? false
          const HotspotIcon = ICON_MAP[hotspot.icon] ?? Battery

          return (
            <button
              key={hotspot.id}
              slot={`hotspot-${hotspot.id}`}
              data-position={hotspot.position}
              data-normal={hotspot.normal}
              data-visibility-attribute="visible"
              className={`
                hotspot-btn
                flex h-10 w-10 items-center justify-center rounded-full
                border-[1.5px] cursor-pointer
                transition-all duration-250 ease-out
                focus-visible:ring-2 focus-visible:ring-ring
                focus-visible:ring-offset-2 focus-visible:ring-offset-background
                ${isActive ? 'scale-110 ring-2 ring-offset-2 ring-offset-background' : ''}
                ${discovered && !isActive ? 'opacity-60 hover:opacity-90' : 'hover:scale-105'}
                ${!isActive && !discovered ? glowClass : ''}
              `}
              style={{
                backgroundColor: discovered
                  ? 'var(--secondary)'
                  : `color-mix(in srgb, ${accentColor} 25%, transparent)`,
                borderColor: isActive
                  ? accentColor
                  : discovered
                    ? 'var(--border)'
                    : `color-mix(in srgb, ${accentColor} 40%, transparent)`,
                ...(isActive ? { ringColor: accentColor } : {}),
              }}
              onClick={() => onHotspotClick?.(hotspot.id)}
              aria-label={`${discovered ? 'Ya descubierto: ' : 'Explorar: '}${hotspot.label}`}
              aria-pressed={isActive}
            >
              {/* Hotspot icon */}
              {discovered && !isActive ? (
                <Check className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              ) : (
                <HotspotIcon
                  className="h-4 w-4"
                  style={{ color: isActive ? accentColor : discovered ? 'var(--muted-foreground)' : accentColor }}
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}

        {/* ===================== LOADING OVERLAY ===================== */}
        {!isLoaded && (
          <div
            slot="poster"
            className="absolute inset-0 flex items-center justify-center bg-background/80"
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/30"
                style={{ borderTopColor: accentColor }}
              />
              <span className="text-xs text-muted-foreground">Cargando modelo 3D…</span>
            </div>
          </div>
        )}
      </model-viewer>
    )
  }
)
