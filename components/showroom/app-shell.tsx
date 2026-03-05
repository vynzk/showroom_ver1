// ===================== COMPONENT: AppShell =====================
/**
 * @fileoverview
 * Main layout shell for the showroom experience.
 * Orchestrates all sub-components and manages responsive layout:
 *
 * DESKTOP (md+):
 *   [ ModelSelectorSidebar | ShowroomStage | SpecDetailPanel (conditional) ]
 *
 * MOBILE:
 *   [ ShowroomStage (full width) ]
 *   + ModelSelectorDrawer (floating button -> bottom sheet)
 *   + SpecDetailPanel as bottom sheet
 *   + ProgressHUD floating overlay
 *
 * README (in-code):
 * ─────────────────────────────────────────────────────────
 * ARCHITECTURE OVERVIEW:
 *   - AppShell: Responsive layout container. Renders sidebar/drawer based on viewport.
 *   - ModelSelectorSidebar: Desktop left panel with model cards.
 *   - ModelSelectorDrawer: Mobile bottom sheet for model selection.
 *   - ShowroomStage: Central 3D viewer area with placeholder for <model-viewer>.
 *   - HotspotOverlay: Positions 5 HotspotBubble components over the stage.
 *   - HotspotBubble: Individual floating animated hotspot with states (normal/active/discovered).
 *   - SpecDetailPanel: Right panel (desktop) or bottom sheet (mobile) with spec details.
 *   - TopBarActions: Model name, Recenter and Help buttons.
 *   - ProgressHUD: Gamification counter (0/5) with progress bar.
 *
 * HOW TO REPLACE PLACEHOLDER WITH <model-viewer>:
 *   See comments in showroom-stage.tsx for step-by-step instructions.
 *
 * HOW TO CONFIGURE HOTSPOT POSITIONS:
 *   Edit the `position` field ({ top, left }) in each Spec in lib/showroom-data.ts.
 *   Values are CSS percentages relative to the stage container.
 *
 * HOW TO ADD A THIRD CAR MODEL:
 *   1. Add a new Model object to MODELS array in lib/showroom-data.ts.
 *   2. Add corresponding Spec[] to the SPECS record keyed by the new model id.
 *   3. Optionally add new accent CSS variables/animations in globals.css.
 *
 * HOW TO CHANGE PALETTE/BRANDING:
 *   Edit CSS custom properties in app/globals.css.
 *   Key tokens: --background, --foreground, --glow-green, --glow-blue, --surface-glass.
 * ─────────────────────────────────────────────────────────
 */

'use client'

import { useShowroomState } from '@/hooks/use-showroom-state'
import { ModelSelectorSidebar } from './model-selector-sidebar'
import { ModelSelectorDrawer } from './model-selector-drawer'
import { ShowroomStage } from './showroom-stage'
import { SpecDetailPanel } from './spec-detail-panel'
import { ProgressHUD } from './progress-hud'
import { OnboardingOverlay } from './onboarding-overlay'

export function AppShell() {
  const {
    selectedModelId,
    selectedModel,
    currentSpecs,
    activeSpecId,
    activeSpec,
    discoveryCount,
    totalSpecs,
    isDrawerOpen,
    isDetailOpen,
    showOnboarding,
    dismissOnboarding,
    environmentImage,
    setEnvironmentImage,
    markRotated,
    markZoomed,
    markChangedLighting,
    currentTip,
    selectModel,
    openSpec,
    closeDetail,
    markAsDiscovered,
    isDiscovered,
    setIsDrawerOpen,
  } = useShowroomState()

  return (
    <main className="flex h-dvh w-full overflow-hidden bg-background">
      {/* ===================== DESKTOP SIDEBAR ===================== */}
      <ModelSelectorSidebar
        selectedModelId={selectedModelId}
        onSelectModel={selectModel}
      />

      {/* ===================== CENTRAL STAGE + DETAIL ===================== */}
      <div className="flex flex-1 gap-3 p-3 md:p-4 min-w-0">
        {/* Stage container */}
        <div className="relative flex flex-1 flex-col min-w-0">
          <ShowroomStage
            model={selectedModel}
            specs={currentSpecs}
            activeSpecId={activeSpecId}
            isDiscovered={isDiscovered}
            onSelectSpec={openSpec}
            environmentImage={environmentImage}
            onEnvironmentChange={(hdri) => {
              setEnvironmentImage(hdri)
              markChangedLighting()
            }}
            onInteraction={(type) => {
              if (type === 'rotate') markRotated()
              else if (type === 'zoom') markZoomed()
            }}
          />

          {/* ===================== PROGRESS HUD (floating) ===================== */}
          <div className="absolute top-16 right-4 z-30 md:top-16 md:right-6">
            <ProgressHUD
              discovered={discoveryCount}
              total={totalSpecs}
              progressClass={selectedModel.progressClass}
              accentClass={selectedModel.accentClass}
              tip={currentTip}
            />
          </div>
        </div>

        {/* ===================== DESKTOP DETAIL PANEL ===================== */}
        <div className="hidden md:block">
          <SpecDetailPanel
            spec={activeSpec}
            model={selectedModel}
            isOpen={isDetailOpen}
            isDiscovered={activeSpecId ? isDiscovered(activeSpecId) : false}
            onClose={closeDetail}
            onMarkDiscovered={markAsDiscovered}
          />
        </div>
      </div>

      {/* ===================== MOBILE DETAIL PANEL (bottom sheet) ===================== */}
      <div className="md:hidden">
        <SpecDetailPanel
          spec={activeSpec}
          model={selectedModel}
          isOpen={isDetailOpen}
          isDiscovered={activeSpecId ? isDiscovered(activeSpecId) : false}
          onClose={closeDetail}
          onMarkDiscovered={markAsDiscovered}
        />
      </div>

      {/* ===================== MOBILE MODEL DRAWER ===================== */}
      <ModelSelectorDrawer
        selectedModelId={selectedModelId}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onSelectModel={selectModel}
      />

      {/* ===================== ONBOARDING OVERLAY ===================== */}
      {showOnboarding && <OnboardingOverlay onDismiss={dismissOnboarding} />}
    </main>
  )
}
