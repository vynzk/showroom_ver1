// ===================== SHOWROOM DATA TYPES & MOCK DATASET =====================
/**
 * @fileoverview
 * Typed data models and mock dataset for the automotive showroom.
 *
 * STRUCTURE:
 * - Model: Represents a car model (Nammi / Vigo) with metadata and accent color.
 * - Spec: Represents a feature/spec hotspot with title, description, and bullets.
 *
 * HOW TO ADD A THIRD CAR:
 * 1. Add a new entry to the MODELS array with a unique `id`.
 * 2. Add 5 Spec entries to the SPECS map keyed by the new model id.
 * 3. Optionally define a new accent color in globals.css.
 *
 * HOW TO CHANGE PALETTE / BRANDING:
 * - Edit CSS variables in app/globals.css (--glow-green, --glow-blue, --surface-glass, etc.)
 * - Each model's `accentClass` maps to Tailwind utility classes for per-model theming.
 */

// ===================== TYPES =====================

/** A car model available in the showroom */
export interface Model {
  id: string
  name: string
  badgeColor: string
  accentColor: string
  accentClass: string
  glowClass: string
  progressClass: string
  description: string
}

/** A feature spec/hotspot attached to a model */
export interface Spec {
  id: string
  label: string
  icon: string
  title: string
  description: string
  bullets: [string, string, string]
  /** Relative position on the stage (percentage) - used by 2D overlay fallback */
  position: { top: string; left: string }
  /**
   * 3D hotspot position on model surface: "Xm Ym Zm"
   * Use https://modelviewer.dev/editor/ to find the correct values.
   */
  hotspotPosition: string
  /**
   * 3D surface normal direction: "Xm Ym Zm"
   * Use https://modelviewer.dev/editor/ to find the correct values.
   */
  hotspotNormal: string
}

// ===================== MOCK DATA =====================

export const MODELS: Model[] = [
  {
    id: 'nammi',
    name: 'Modelo Nammi',
    badgeColor: 'bg-[#B8FF3D]/20 text-[#0F0F10]',
    accentColor: '#B8FF3D',
    accentClass: 'text-[#B8FF3D]',
    glowClass: 'animate-pulse-glow',
    progressClass: 'progress-fill-green',
    description: 'De ultima generacion en un diseno compacto y futurista.',
  }
  // {
  //   id: 'vigo',
  //   name: 'Modelo Vigo',
  //   badgeColor: 'bg-[#5CE1E6]/20 text-[#0F0F10]',
  //   accentColor: '#5CE1E6',
  //   accentClass: 'text-[#5CE1E6]',
  //   glowClass: 'animate-pulse-glow-blue',
  //   progressClass: 'progress-fill-blue',
  //   description: 'Potencia y confort ',
  // },
]

export const SPECS: Record<string, Spec[]> = {
  nammi: [
    {
      id: 'autonomia',
      label: 'Autonomía Eléctrica',
      icon: 'battery',
      title: 'Autonomía optimizada',
      description:
        'El Nammi 001 ofrece una autonomía optimizada para la ciudad y trayectos interurbanos, combinando eficiencia energética con tecnología 100% eléctrica.',
      bullets: [
        'Hasta 430 km de autonomía (NEDC)',
        'Batería LFP (Litio-Ferrofosfato) de 42,3 kWh',
        'Carga rápida DC (20% – 80%) en aproximadamente 30 minutos',
      ],
      position: { top: '20%', left: '25%' },
      hotspotPosition: '0.8m 0.3m 1.5m',
      hotspotNormal: '0m 1m 0m',
    },
    {
      id: 'seguridad',
      label: 'Seguridad Inteligente (ADAS)',
      icon: 'shield',
      title: 'Asistencias avanzadas a la conducción',
      description:
        'Incorpora asistencias avanzadas a la conducción que elevan la seguridad activa y pasiva del vehículo.',
      bullets: [
        'Sistema ADAS (Asistencias avanzadas a la conducción)',
        'Asistente de colisión frontal (FCA)',
        'Asistente de mantenimiento y seguimiento de carril (LKA)',
      ],
      position: { top: '15%', left: '50%' },
      hotspotPosition: '0m 1.2m 0.8m',
      hotspotNormal: '0m 0m 1m',
    },
    {
      id: 'camara',
      label: 'Cámara 360° y Estacionamiento',
      icon: 'camera',
      title: 'Visión panorámica y asistencia',
      description:
        'Sistema de visión panorámica que facilita maniobras y estacionamiento en espacios reducidos.',
      bullets: [
        'Cámara de estacionamiento 360°',
        'Sensores de proximidad delanteros y traseros',
        'Asistencia de estacionamiento automático (según versión)',
      ],
      position: { top: '30%', left: '75%' },
      hotspotPosition: '-0.8m 0.8m -1.2m',
      hotspotNormal: '-1m 0m 0m',
    },
    {
      id: 'conectividad',
      label: 'Conectividad y Pantalla 12,8”',
      icon: 'wifi',
      title: 'Multimedia e integración total',
      description:
        'Sistema multimedia moderno con integración total para smartphones y control intuitivo.',
      bullets: [
        'Pantalla central de 12,8 pulgadas',
        'Apple CarPlay & Android Auto inalámbrico',
        'Bluetooth con reconocimiento de voz',
      ],
      position: { top: '55%', left: '30%' },
      hotspotPosition: '0m 0.7m 0m',
      hotspotNormal: '0m 0m 1m',
    },
    {
      id: 'diseno',
      label: 'Diseño y Tecnología Exterior',
      icon: 'lightbulb',
      title: 'Minimalismo y detalles eléctricos',
      description:
        'Diseño minimalista y futurista con detalles tecnológicos que refuerzan su identidad eléctrica.',
      bullets: [
        'Luces delanteras y traseras LED',
        'Manillas de puertas ocultas',
        'Puertas sin marco',
      ],
      position: { top: '60%', left: '65%' },
      hotspotPosition: '1.5m 0.5m -0.5m',
      hotspotNormal: '1m 0m 0m',
    },
  ],
  vigo: [
    {
      id: 'autonomia',
      label: 'Autonomia Superior',
      icon: 'battery',
      title: 'Autonomia Extendida',
      description:
        'Alcanza hasta 680 km con su pack de baterias de 82 kWh y aerodinamica optimizada por CFD.',
      bullets: [
        'Bateria NMC de 82 kWh con carga rapida 250kW',
        'Cd de 0.23 para maxima eficiencia',
        'Precondicionamiento termico inteligente',
      ],
      position: { top: '20%', left: '25%' },
      hotspotPosition: '0.8m 0.3m 1.5m',
      hotspotNormal: '0m 1m 0m',
    },
    {
      id: 'seguridad',
      label: 'Seguridad Premium',
      icon: 'shield',
      title: 'Seguridad Integral',
      description:
        'Certificacion Euro NCAP 5 estrellas con sistema de proteccion perimetral completo.',
      bullets: [
        '10 airbags con airbag central delantero',
        'Vision nocturna con deteccion de peatones',
        'Estructura UHSS con zonas de deformacion',
      ],
      position: { top: '15%', left: '50%' },
      hotspotPosition: '0m 1.2m 0.8m',
      hotspotNormal: '0m 0m 1m',
    },
    {
      id: 'conectividad',
      label: 'Conectividad y Pantalla 12,8”',
      icon: 'display',
      title: 'Suite Digital',
      description:
        'Doble pantalla OLED de 15.6" y 12.3" con procesador de 8 nucleos y conectividad 5G.',
      bullets: [
        'Display principal OLED de 15.6 pulgadas',
        'Cluster digital de 12.3 pulgadas',
        'Conectividad 5G con hotspot integrado',
      ],
      position: { top: '30%', left: '75%' },
      hotspotPosition: '-0.8m 0.8m -1.2m',
      hotspotNormal: '-1m 0m 0m',
    },
    {
      id: 'asistencia',
      label: 'Asistencia',
      icon: 'cpu',
      title: 'Piloto Avanzado',
      description:
        'Sistema de conduccion semi-autonoma nivel 2+ con LiDAR, 8 camaras y computacion neuronal.',
      bullets: [
        'LiDAR de estado solido de largo alcance',
        'Cambio de carril automatico supervisado',
        'Summon: el auto viene a ti desde el parking',
      ],
      position: { top: '55%', left: '30%' },
      hotspotPosition: '0m 0.7m 0m',
      hotspotNormal: '0m 0m 1m',
    },
    {
      id: 'navegacion',
      label: 'Navegacion',
      icon: 'map',
      title: 'Navegacion Inteligente',
      description:
        'Sistema de navegacion con planificacion de ruta optimizada, integracion de cargadores y datos en tiempo real.',
      bullets: [
        'Planificacion de ruta con paradas de carga',
        'Mapas 3D con actualizacion en tiempo real',
        'Busqueda por voz con IA integrada',
      ],
      position: { top: '60%', left: '65%' },
      hotspotPosition: '1.5m 0.5m -0.5m',
      hotspotNormal: '1m 0m 0m',
    },
  ],
}
