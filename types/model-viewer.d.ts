// ===================== TYPE DECLARATIONS: <model-viewer> =====================
/**
 * @fileoverview
 * TypeScript declarations for the @google/model-viewer web component.
 * This allows using <model-viewer> in JSX/TSX without type errors.
 *
 * Works with React 19+ where JSX types live under React.JSX namespace.
 * Reference: https://modelviewer.dev/docs/
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type ModelViewerAttributes = DetailedHTMLProps<
  HTMLAttributes<HTMLElement> & {
    src?: string
    alt?: string
    poster?: string
    'camera-controls'?: boolean
    'touch-action'?: string
    'interaction-prompt'?: 'auto' | 'none'
    'shadow-intensity'?: string
    exposure?: string
    'camera-orbit'?: string
    'camera-target'?: string
    'min-camera-orbit'?: string
    'max-camera-orbit'?: string
    'min-field-of-view'?: string
    'max-field-of-view'?: string
    'auto-rotate'?: boolean
    'auto-rotate-delay'?: string
    'rotation-per-second'?: string
    'environment-image'?: string
    'skybox-image'?: string
    loading?: 'auto' | 'lazy' | 'eager'
    reveal?: 'auto' | 'manual'
    [key: string]: any
  },
  HTMLElement
>

// React 19: JSX namespace lives inside the 'react' module
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerAttributes
    }
  }
}

// Also declare globally for environments that use global JSX
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerAttributes
    }
  }
}
