<template>
  <div class="orientation-view">
    <svg
      :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`"
      class="orientation-svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="magFieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4facfe" />
          <stop offset="50%" stop-color="#00f2fe" />
          <stop offset="100%" stop-color="#43e97b" />
        </linearGradient>
        <linearGradient id="magFieldGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ff9a9e" />
          <stop offset="50%" stop-color="#fecfef" />
          <stop offset="100%" stop-color="#fecfef" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" :width="viewBoxWidth" :height="viewBoxHeight" fill="#fafafa" />

      <g v-for="line in fieldLines" :key="line.id">
        <path
          :d="line.path"
          fill="none"
          :stroke="line.color"
          stroke-width="1.5"
          filter="url(#glow)"
          :opacity="line.opacity"
        />
      </g>

      <g v-for="cell in gradientCells" :key="cell.id">
        <rect
          :x="cell.x"
          :y="cell.y"
          :width="cell.w"
          :height="cell.h"
          :fill="cell.color"
        />
      </g>

      <g v-for="arrow in arrows" :key="arrow.id">
        <line
          :x1="arrow.x1"
          :y1="arrow.y1"
          :x2="arrow.x2"
          :y2="arrow.y2"
          stroke="#333"
          stroke-width="1.5"
          marker-end="url(#arrowEnd)"
        />
      </g>

      <g>
        <rect
          :x="upperX"
          :y="upperY"
          :width="upperW"
          :height="upperH"
          fill="rgba(139, 170, 220, 0.3)"
          stroke="#2c5282"
          stroke-width="1.5"
          stroke-dasharray="4,4"
        />
        <text :x="upperX + upperW / 2" :y="upperY + upperH / 2 + 4" text-anchor="middle" font-size="11" fill="#2c5282" font-weight="600">上模体</text>
      </g>

      <g>
        <rect
          :x="lowerX"
          :y="lowerY"
          :width="lowerW"
          :height="lowerH"
          fill="rgba(205, 92, 92, 0.3)"
          stroke="#b03030"
          stroke-width="1.5"
          stroke-dasharray="4,4"
        />
        <text :x="lowerX + lowerW / 2" :y="lowerY + lowerH / 2 + 4" text-anchor="middle" font-size="11" fill="#b03030" font-weight="600">下冲模</text>
      </g>

      <g>
        <rect
          :x="rawX"
          :y="rawY"
          :width="rawW"
          :height="rawH"
          fill="rgba(168, 197, 224, 0.5)"
          stroke="#3b6ec5"
          stroke-width="1.5"
        />
        <text :x="rawX + rawW / 2" :y="rawY + rawH / 2 + 4" text-anchor="middle" font-size="12" fill="#2c5282" font-weight="600">生坯</text>
      </g>

      <marker
        id="arrowEnd"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#333" />
      </marker>

      <g class="legend">
        <rect x="viewBoxWidth - 160" y="20" width="140" height="30" fill="#fff" stroke="#ddd" stroke-width="1" rx="4" />
        <text :x="viewBoxWidth - 150" y="35" font-size="10" fill="#666">磁场强度:</text>
        <rect :x="viewBoxWidth - 130" y="38" width="100" height="8" fill="url(#magFieldGrad)" rx="2" />
        <text :x="viewBoxWidth - 128" y="52" font-size="9" fill="#666">弱</text>
        <text :x="viewBoxWidth - 45" y="52" font-size="9" fill="#666">强</text>
      </g>

      <text :x="viewBoxWidth / 2" y="28" text-anchor="middle" font-size="16" fill="#1a365d" font-weight="700">
        横截面取向图（磁场分布）
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  form: { type: Object, default: () => ({}) },
  moldType: { type: String, default: 'block' }
})

const viewBoxWidth = 780
const viewBoxHeight = 540
const marginX = 40
const marginY = 60

const scale = computed(() => {
  const availW = viewBoxWidth - marginX * 2 - 120
  const availH = viewBoxHeight - marginY * 2
  const totalW = props.form.w1 + 10 || 50
  const totalH = props.form.h1 + props.form.h2 + props.form.h + 20 || 50
  return Math.min(availW / totalW, availH / totalH, 5)
})

const centerX = computed(() => viewBoxWidth / 2)

const upperW = computed(() => (props.form.w1 || 40) * scale.value)
const upperH = computed(() => (props.form.h1 || 33) * scale.value)
const upperX = computed(() => centerX.value - upperW.value / 2)
const upperY = computed(() => marginY + 10)

const lowerW = computed(() => (props.form.w || 40) * scale.value)
const lowerH = computed(() => (props.form.h2 || 6) * scale.value)
const lowerX = computed(() => centerX.value - lowerW.value / 2)
const lowerY = computed(() => upperY.value + upperH.value + 15 * scale.value)

const rawW = computed(() => (props.form.w || 40) * scale.value)
const rawH = computed(() => (props.form.h || 15) * scale.value)
const rawX = computed(() => centerX.value - rawW.value / 2)
const rawY = computed(() => lowerY.value + lowerH.value + 10 * scale.value)

const fieldLines = computed(() => {
  const lines = []
  const s = scale.value
  const center = centerX.value
  const upperBottom = upperY.value + upperH.value
  const lowerTop = lowerY.value
  const rawTop = rawY.value
  const rawBottom = rawY.value + rawH.value

  const lineCount = 8
  const spacing = rawW.value / (lineCount + 1)

  for (let i = 1; i <= lineCount; i++) {
    const x = center - rawW.value / 2 + i * spacing
    const intensity = Math.abs(i - (lineCount + 1) / 2) / ((lineCount + 1) / 2)
    const color = intensity < 0.3 ? '#43e97b' : intensity < 0.7 ? '#00f2fe' : '#4facfe'

    const path = `M ${x} ${upperBottom} C ${x - 5 * s} ${(upperBottom + lowerTop) / 2}, ${x + 5 * s} ${(upperBottom + lowerTop) / 2}, ${x} ${lowerTop} L ${x} ${rawTop} C ${x - 8 * s} ${(rawTop + rawBottom) / 2}, ${x + 8 * s} ${(rawTop + rawBottom) / 2}, ${x} ${rawBottom}`
    lines.push({
      id: `line-${i}`,
      path,
      color,
      opacity: 0.6 + intensity * 0.4
    })
  }

  return lines
})

const gradientCells = computed(() => {
  const cells = []
  const cellW = 8
  const cellH = 8
  const startX = rawX.value - cellW * 2
  const startY = upperY.value - cellH

  for (let y = 0; y < (rawH.value + upperH.value + lowerH.value + 30 * scale.value) / cellH; y++) {
    for (let x = 0; x < (rawW.value + cellW * 4) / cellW; x++) {
      const cx = startX + x * cellW
      const cy = startY + y * cellH

      const distFromCenter = Math.abs(cx - centerX.value) / (rawW.value / 2 + cellW * 2)
      const distFromGap = Math.abs(cy - (upperY.value + upperH.value + 7.5 * scale.value)) / (rawH.value + 15 * scale.value)

      const intensity = Math.max(0, 1 - distFromCenter * 1.5 - distFromGap * 0.8)

      let color = '#e8f4fd'
      if (intensity > 0.7) {
        color = '#43e97b'
      } else if (intensity > 0.4) {
        color = '#00f2fe'
      } else if (intensity > 0.2) {
        color = '#4facfe'
      }

      cells.push({
        id: `cell-${x}-${y}`,
        x: cx,
        y: cy,
        w: cellW,
        h: cellH,
        color
      })
    }
  }

  return cells
})

const arrows = computed(() => {
  const arrowList = []
  const s = scale.value
  const center = centerX.value
  const rawCenterY = rawY.value + rawH.value / 2

  const arrowCount = 5
  const spacing = rawW.value / (arrowCount + 1)

  for (let i = 1; i <= arrowCount; i++) {
    const x = center - rawW.value / 2 + i * spacing
    arrowList.push({
      id: `arrow-${i}`,
      x1: x - 15 * s,
      y1: rawCenterY,
      x2: x + 15 * s,
      y2: rawCenterY
    })
  }

  return arrowList
})
</script>

<style scoped>
.orientation-view {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.orientation-svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>