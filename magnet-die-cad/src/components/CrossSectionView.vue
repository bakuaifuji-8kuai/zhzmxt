<template>
  <div class="cross-section-view">
    <svg
      ref="svgRef"
      :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`"
      class="section-svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="hatch70mn" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#c8a25a" stroke-width="1.5" />
        </pattern>
        <pattern id="hatchStellite" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#d46a6a" stroke-width="1.2" />
        </pattern>
        <pattern id="hatchRaw" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(0)">
          <rect width="5" height="5" fill="#e8f0fe" />
          <line x1="0" y1="0" x2="5" y2="5" stroke="#7aa3e5" stroke-width="0.8" />
          <line x1="5" y1="0" x2="0" y2="5" stroke="#7aa3e5" stroke-width="0.8" />
        </pattern>
        <pattern id="hatchSteel" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#4a7abc" stroke-width="1" />
        </pattern>
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
        <marker
          id="arrowStart"
          viewBox="0 0 10 10"
          refX="1"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 10 0 L 0 5 L 10 10 z" fill="#333" />
        </marker>
      </defs>

      <rect x="0" y="0" :width="viewBoxWidth" :height="viewBoxHeight" fill="#fafafa" />

      <g v-for="line in gridLines" :key="line.id">
        <line
          v-if="line.type === 'h'"
          :x1="marginX"
          :y1="line.pos"
          :x2="viewBoxWidth - marginX"
          :y2="line.pos"
          stroke="#e5e5e5"
          stroke-width="0.5"
        />
        <line
          v-else
          :x1="line.pos"
          :y1="marginY"
          :x2="line.pos"
          :y2="viewBoxHeight - marginY"
          stroke="#e5e5e5"
          stroke-width="0.5"
        />
      </g>

      <g>
        <rect
          :x="upperDie.x"
          :y="upperDie.y"
          :width="upperDie.w"
          :height="upperDie.h"
          fill="url(#hatchSteel)"
          stroke="#2c5282"
          stroke-width="1.5"
        />
        <rect
          :x="upperDie.coreX"
          :y="upperDie.coreY"
          :width="upperDie.coreW"
          :height="upperDie.coreH"
          fill="url(#hatch70mn)"
          stroke="#b8860b"
          stroke-width="1.2"
        />
        <text
          :x="upperDie.x + upperDie.w / 2"
          :y="upperDie.coreY + upperDie.coreH / 2 + 4"
          text-anchor="middle"
          font-size="12"
          fill="#8b6914"
          font-weight="600"
        >
          70Mn 不导磁层
        </text>
        <text
          :x="upperDie.x + 10"
          :y="upperDie.y + 18"
          font-size="11"
          fill="#2c5282"
          font-weight="600"
        >
          上模体
        </text>

        <rect
          :x="lowerPunch.x"
          :y="lowerPunch.y"
          :width="lowerPunch.w"
          :height="lowerPunch.h"
          fill="url(#hatchStellite)"
          stroke="#b03030"
          stroke-width="1.5"
        />
        <text
          :x="lowerPunch.x + lowerPunch.w / 2"
          :y="lowerPunch.y + lowerPunch.h / 2 + 4"
          text-anchor="middle"
          font-size="12"
          fill="#8b2020"
          font-weight="600"
        >
          司太立不导磁层
        </text>
        <text
          :x="lowerPunch.x + lowerPunch.w - 10"
          :y="lowerPunch.y + lowerPunch.h / 2 + 4"
          text-anchor="end"
          font-size="11"
          fill="#8b2020"
          font-weight="600"
        >
          下冲模
        </text>

        <rect
          :x="rawBody.x"
          :y="rawBody.y"
          :width="rawBody.w"
          :height="rawBody.h"
          fill="url(#hatchRaw)"
          stroke="#3b6ec5"
          stroke-width="1.5"
        />
        <text
          :x="rawBody.x + rawBody.w / 2"
          :y="rawBody.y + rawBody.h / 2 + 4"
          text-anchor="middle"
          font-size="12"
          fill="#2c5282"
          font-weight="600"
        >
          生坯
        </text>

        <g v-if="showDims" class="dimension-group">
          <g class="dim-top">
            <line
              :x1="upperDie.x"
              :y1="upperDie.y - 24"
              :x2="upperDie.x + upperDie.w"
              :y2="upperDie.y - 24"
              stroke="#333"
              stroke-width="0.8"
              marker-start="url(#arrowStart)"
              marker-end="url(#arrowEnd)"
            />
            <line :x1="upperDie.x" :y1="upperDie.y - 32" :x2="upperDie.x" :y2="upperDie.y - 16" stroke="#333" stroke-width="0.8" />
            <line :x1="upperDie.x + upperDie.w" :y1="upperDie.y - 32" :x2="upperDie.x + upperDie.w" :y2="upperDie.y - 16" stroke="#333" stroke-width="0.8" />
            <rect
              :x="upperDie.x + upperDie.w / 2 - 45"
              :y="upperDie.y - 38"
              width="90"
              height="16"
              fill="#fafafa"
              stroke="none"
            />
            <text
              :x="upperDie.x + upperDie.w / 2"
              :y="upperDie.y - 27"
              text-anchor="middle"
              font-size="11"
              fill="#222"
              font-weight="500"
            >
              w₁ = {{ w1.toFixed(1) }} mm
            </text>
          </g>

          <g class="dim-bottom">
            <line
              :x1="rawBody.x"
              :y1="rawBody.y + rawBody.h + 24"
              :x2="rawBody.x + rawBody.w"
              :y2="rawBody.y + rawBody.h + 24"
              stroke="#333"
              stroke-width="0.8"
              marker-start="url(#arrowStart)"
              marker-end="url(#arrowEnd)"
            />
            <line :x1="rawBody.x" :y1="rawBody.y + rawBody.h + 16" :x2="rawBody.x" :y2="rawBody.y + rawBody.h + 32" stroke="#333" stroke-width="0.8" />
            <line :x1="rawBody.x + rawBody.w" :y1="rawBody.y + rawBody.h + 16" :x2="rawBody.x + rawBody.w" :y2="rawBody.y + rawBody.h + 32" stroke="#333" stroke-width="0.8" />
            <rect
              :x="rawBody.x + rawBody.w / 2 - 38"
              :y="rawBody.y + rawBody.h + 28"
              width="76"
              height="16"
              fill="#fafafa"
              stroke="none"
            />
            <text
              :x="rawBody.x + rawBody.w / 2"
              :y="rawBody.y + rawBody.h + 39"
              text-anchor="middle"
              font-size="11"
              fill="#222"
              font-weight="500"
            >
              w = {{ w.toFixed(1) }} mm
            </text>
          </g>

          <g class="dim-left-1">
            <line
              :x1="upperDie.x - 50"
              :y1="upperDie.y"
              :x2="upperDie.x - 50"
              :y2="upperDie.y + upperDie.h"
              stroke="#333"
              stroke-width="0.8"
              marker-start="url(#arrowStart)"
              marker-end="url(#arrowEnd)"
            />
            <line :x1="upperDie.x - 58" :y1="upperDie.y" :x2="upperDie.x - 42" :y2="upperDie.y" stroke="#333" stroke-width="0.8" />
            <line :x1="upperDie.x - 58" :y1="upperDie.y + upperDie.h" :x2="upperDie.x - 42" :y2="upperDie.y + upperDie.h" stroke="#333" stroke-width="0.8" />
            <text
              :x="upperDie.x - 62"
              :y="upperDie.y + upperDie.h / 2 + 4"
              text-anchor="end"
              font-size="11"
              fill="#222"
              font-weight="500"
            >
              h₁ = {{ h1.toFixed(1) }} mm
            </text>
          </g>

          <g class="dim-left-2">
            <line
              :x1="lowerPunch.x - 30"
              :y1="lowerPunch.y"
              :x2="lowerPunch.x - 30"
              :y2="lowerPunch.y + lowerPunch.h"
              stroke="#333"
              stroke-width="0.8"
              marker-start="url(#arrowStart)"
              marker-end="url(#arrowEnd)"
            />
            <line :x1="lowerPunch.x - 38" :y1="lowerPunch.y" :x2="lowerPunch.x - 22" :y2="lowerPunch.y" stroke="#333" stroke-width="0.8" />
            <line :x1="lowerPunch.x - 38" :y1="lowerPunch.y + lowerPunch.h" :x2="lowerPunch.x - 22" :y2="lowerPunch.y + lowerPunch.h" stroke="#333" stroke-width="0.8" />
            <text
              :x="lowerPunch.x - 42"
              :y="lowerPunch.y + lowerPunch.h / 2 + 4"
              text-anchor="end"
              font-size="11"
              fill="#222"
              font-weight="500"
            >
              h₂ = {{ h2.toFixed(1) }} mm
            </text>
          </g>

          <g class="dim-left-3">
            <line
              :x1="rawBody.x - 70"
              :y1="rawBody.y"
              :x2="rawBody.x - 70"
              :y2="rawBody.y + rawBody.h"
              stroke="#333"
              stroke-width="0.8"
              marker-start="url(#arrowStart)"
              marker-end="url(#arrowEnd)"
            />
            <line :x1="rawBody.x - 78" :y1="rawBody.y" :x2="rawBody.x - 62" :y2="rawBody.y" stroke="#333" stroke-width="0.8" />
            <line :x1="rawBody.x - 78" :y1="rawBody.y + rawBody.h" :x2="rawBody.x - 62" :y2="rawBody.y + rawBody.h" stroke="#333" stroke-width="0.8" />
            <text
              :x="rawBody.x - 82"
              :y="rawBody.y + rawBody.h / 2 + 4"
              text-anchor="end"
              font-size="11"
              fill="#222"
              font-weight="500"
            >
              h = {{ h.toFixed(1) }} mm
            </text>
          </g>
        </g>

        <g class="center-lines" v-if="showDims">
          <line
            :x1="centerX"
            :y1="upperDie.y - 10"
            :x2="centerX"
            :y2="rawBody.y + rawBody.h + 10"
            stroke="#888"
            stroke-width="0.6"
            stroke-dasharray="6,4"
          />
        </g>
      </g>

      <text :x="viewBoxWidth / 2" y="28" text-anchor="middle" font-size="16" fill="#1a365d" font-weight="700">
        方块磁模具磁路截面示意图
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  w: { type: Number, default: 40 },
  h: { type: Number, default: 15 },
  h1: { type: Number, default: 33 },
  h2: { type: Number, default: 6 },
  w1: { type: Number, default: 46 },
  showDims: { type: Boolean, default: true }
})

const viewBoxWidth = 780
const viewBoxHeight = 540
const marginX = 40
const marginY = 40

const leftDimSpace = 100
const rightSpace = 30
const topSpace = 55
const bottomSpace = 70

const scale = computed(() => {
  const availW = viewBoxWidth - marginX * 2 - leftDimSpace - rightSpace
  const availH = viewBoxHeight - marginY * 2 - topSpace - bottomSpace
  const totalH = props.h1 + 15 + props.h2 + 10 + props.h
  return Math.min(availW / (props.w1 + 20), availH / totalH)
})

const centerX = computed(() => marginX + leftDimSpace + ((viewBoxWidth - marginX * 2 - leftDimSpace - rightSpace)) / 2)

const upperDie = computed(() => {
  const w = props.w1 * scale.value
  const h = props.h1 * scale.value
  const x = centerX.value - w / 2
  const y = marginY + topSpace
  const coreW = (props.w1 - 6) * scale.value
  const coreH = (props.h1 - 10) * scale.value
  const coreX = x + 3 * scale.value
  const coreY = y + 5 * scale.value
  return { x, y, w, h, coreX, coreY, coreW, coreH }
})

const lowerPunch = computed(() => {
  const w = props.w * scale.value
  const h = props.h2 * scale.value
  const x = centerX.value - w / 2
  const y = upperDie.value.y + upperDie.value.h + 15 * scale.value
  return { x, y, w, h }
})

const rawBody = computed(() => {
  const w = props.w * scale.value
  const h = props.h * scale.value
  const x = centerX.value - w / 2
  const y = lowerPunch.value.y + lowerPunch.value.h + 10 * scale.value
  return { x, y, w, h }
})

const gridLines = computed(() => {
  const lines = []
  const gridSize = 25
  for (let y = marginY; y <= viewBoxHeight - marginY; y += gridSize) {
    lines.push({ id: `h-${y}`, type: 'h', pos: y })
  }
  for (let x = marginX; x <= viewBoxWidth - marginX; x += gridSize) {
    lines.push({ id: `v-${x}`, type: 'v', pos: x })
  }
  return lines
})
</script>

<style scoped>
.cross-section-view {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.section-svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
