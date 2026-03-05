// ===================== COMPOSABLE: useShowroomState =====================
/**
 * @fileoverview
 * Central state management for the showroom experience.
 * Acts as a simple reactive store using React useState.
 *
 * Manages:
 * - selectedModelId: Which car model is currently displayed.
 * - activeSpecId: Which spec hotspot is currently active/open (null = none).
 * - discoveredSpecIds: Set of spec IDs the user has already discovered (gamification).
 * - isDrawerOpen: Mobile model-selector drawer visibility.
 * - isDetailOpen: Spec detail panel visibility.
 *
 * All state is local to the component tree (no global state needed).
 */

'use client'

import { useState, useCallback, useMemo } from 'react'
import { MODELS, SPECS } from '@/lib/showroom-data'

export function useShowroomState() {
  const [selectedModelId, setSelectedModelId] = useState<string>(MODELS[0].id)
  const [activeSpecId, setActiveSpecId] = useState<string | null>(null)
  const [discoveredSpecIds, setDiscoveredSpecIds] = useState<Set<string>>(new Set())
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  /** The currently selected model object */
  const selectedModel = useMemo(
    () => MODELS.find((m) => m.id === selectedModelId) ?? MODELS[0],
    [selectedModelId]
  )

  /** Specs for the currently selected model */
  const currentSpecs = useMemo(
    () => SPECS[selectedModelId] ?? [],
    [selectedModelId]
  )

  /** The currently active spec object (if any) */
  const activeSpec = useMemo(
    () => currentSpecs.find((s) => s.id === activeSpecId) ?? null,
    [currentSpecs, activeSpecId]
  )

  /** Discovery progress for gamification */
  const discoveryCount = useMemo(() => {
    return currentSpecs.filter((s) => discoveredSpecIds.has(`${selectedModelId}-${s.id}`)).length
  }, [currentSpecs, discoveredSpecIds, selectedModelId])

  const totalSpecs = currentSpecs.length

  /** Select a different car model and reset active spec */
  const selectModel = useCallback((modelId: string) => {
    setSelectedModelId(modelId)
    setActiveSpecId(null)
    setIsDetailOpen(false)
    setIsDrawerOpen(false)
  }, [])

  /** Open a spec hotspot detail panel */
  const openSpec = useCallback((specId: string) => {
    setActiveSpecId(specId)
    setIsDetailOpen(true)
  }, [])

  /** Close the detail panel */
  const closeDetail = useCallback(() => {
    setActiveSpecId(null)
    setIsDetailOpen(false)
  }, [])

  /** Mark the currently active spec as discovered */
  const markAsDiscovered = useCallback(() => {
    if (activeSpecId) {
      setDiscoveredSpecIds((prev) => {
        const next = new Set(prev)
        next.add(`${selectedModelId}-${activeSpecId}`)
        return next
      })
    }
  }, [activeSpecId, selectedModelId])

  /** Check if a spec is discovered */
  const isDiscovered = useCallback(
    (specId: string) => discoveredSpecIds.has(`${selectedModelId}-${specId}`),
    [discoveredSpecIds, selectedModelId]
  )

  return {
    // State
    selectedModelId,
    selectedModel,
    currentSpecs,
    activeSpecId,
    activeSpec,
    discoveredSpecIds,
    discoveryCount,
    totalSpecs,
    isDrawerOpen,
    isDetailOpen,

    // Actions
    selectModel,
    openSpec,
    closeDetail,
    markAsDiscovered,
    isDiscovered,
    setIsDrawerOpen,
  }
}
