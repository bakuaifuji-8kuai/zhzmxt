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

      <template v-if="moldType === 'block'">
        <g>
          <rect :x="block.upper.x" :y="block.upper.y" :width="block.upper.w" :height="block.upper.h" fill="url(#hatchSteel)" stroke="#2c5282" stroke-width="1.5" />
          <rect :x="block.upper.coreX" :y="block.upper.coreY" :width="block.upper.coreW" :height="block.upper.coreH" fill="url(#hatch70mn)" stroke="#b8860b" stroke-width="1.2" />
          <text :x="block.upper.coreX + block.upper.coreW / 2" :y="block.upper.coreY + block.upper.coreH / 2 + 4" text-anchor="middle" font-size="11" fill="#8b6914" font-weight="600">70Mn</text>
          <text :x="block.upper.x + 8" :y="block.upper.y + 14" font-size="10" fill="#2c5282" font-weight="600">上模体</text>

          <rect :x="block.lower.x" :y="block.lower.y" :width="block.lower.w" :height="block.lower.h" fill="url(#hatchStellite)" stroke="#b03030" stroke-width="1.5" />
          <text :x="block.lower.x + block.lower.w / 2" :y="block.lower.y + block.lower.h / 2 + 4" text-anchor="middle" font-size="11" fill="#8b2020" font-weight="600">司太立</text>
          <text :x="block.lower.x + block.lower.w - 8" :y="block.lower.y + block.lower.h / 2 + 4" text-anchor="end" font-size="10" fill="#8b2020" font-weight="600">下冲模</text>

          <rect :x="block.raw.x" :y="block.raw.y" :width="block.raw.w" :height="block.raw.h" fill="url(#hatchRaw)" stroke="#3b6ec5" stroke-width="1.5" />
          <text :x="block.raw.x + block.raw.w / 2" :y="block.raw.y + block.raw.h / 2 + 4" text-anchor="middle" font-size="12" fill="#2c5282" font-weight="600">生坯</text>

          <g v-if="showDims" class="dimension-group">
            <g>
              <line :x1="block.upper.x" :y1="block.upper.y - 20" :x2="block.upper.x + block.upper.w" :y2="block.upper.y - 20" stroke="#333" stroke-width="0.8" marker-start="url(#arrowStart)" marker-end="url(#arrowEnd)" />
              <line :x1="block.upper.x" :y1="block.upper.y - 28" :x2="block.upper.x" :y2="block.upper.y - 12" stroke="#333" stroke-width="0.8" />
              <line :x1="block.upper.x + block.upper.w" :y1="block.upper.y - 28" :x2="block.upper.x + block.upper.w" :y2="block.upper.y - 12" stroke-width="0.8" />
              <text :x="block.upper.x + block.upper.w / 2" :y="block.upper.y - 23" text-anchor="middle" font-size="10" fill="#222" font-weight="500">w₁={{ form.w1.toFixed(1) }}mm</text>
            </g>
            <g>
              <line :x1="block.raw.x" :y1="block.raw.y + block.raw.h + 20" :x2="block.raw.x + block.raw.w" :y2="block.raw.y + block.raw.h + 20" stroke="#333" stroke-width="0.8" marker-start="url(#arrowStart)" marker-end="url(#arrowEnd)" />
              <text :x="block.raw.x + block.raw.w / 2" :y="block.raw.y + block.raw.h + 33" text-anchor="middle" font-size="10" fill="#222" font-weight="500">w={{ form.w.toFixed(1) }}mm</text>
            </g>
            <g>
              <line :x1="block.upper.x - 45" :y1="block.upper.y" :x2="block.upper.x - 45" :y2="block.upper.y + block.upper.h" stroke="#333" stroke-width="0.8" marker-start="url(#arrowStart)" marker-end="url(#arrowEnd)" />
              <text :x="block.upper.x - 50" :y="block.upper.y + block.upper.h / 2 + 3" text-anchor="end" font-size="10" fill="#222" font-weight="500">h₁={{ form.h1.toFixed(1) }}mm</text>
            </g>
            <g>
              <line :x1="block.lower.x - 45" :y1="block.lower.y" :x2="block.lower.x - 45" :y2="block.lower.y + block.lower.h" stroke="#333" stroke-width="0.8" marker-start="url(#arrowStart)" marker-end="url(#arrowEnd)" />
              <text :x="block.lower.x - 50" :y="block.lower.y + block.lower.h / 2 + 3" text-anchor="end" font-size="10" fill="#222" font-weight="500">h₂={{ form.h2.toFixed(1) }}mm</text>
            </g>
            <g>
              <line :x1="block.raw.x - 65" :y1="block.raw.y" :x2="block.raw.x - 65" :y2="block.raw.y + block.raw.h" stroke="#333" stroke-width="0.8" marker-start="url(#arrowStart)" marker-end="url(#arrowEnd)" />
              <text :x="block.raw.x - 70" :y="block.raw.y + block.raw.h / 2 + 3" text-anchor="end" font-size="10" fill="#222" font-weight="500">h={{ form.h.toFixed(1) }}mm</text>
            </g>
          </g>
        </g>
      </template>

      <template v-else-if="moldType === 'inner_arc'">
        <g>
          <ellipse :cx="centerX" :cy="arcInner.upperCenterY" :rx="arcInner.upperOuterR" :ry="arcInner.upperOuterR" fill="none" stroke="#2c5282" stroke-width="1.5" />
          <ellipse :cx="centerX" :cy="arcInner.upperCenterY" :rx="arcInner.upperInnerR" :ry="arcInner.upperInnerR" fill="none" stroke="#2c5282" stroke-width="1.5" />
          <path :d="arcInner.upperPath" fill="url(#hatchSteel)" stroke="#2c5282" stroke-width="1.5" />
          <text :x="centerX" :y="arcInner.upperCenterY - arcInner.upperOuterR - 8" text-anchor="middle" font-size="10" fill="#2c5282" font-weight="600">上模体</text>

          <rect :x="arcInner.lower.x" :y="arcInner.lower.y" :width="arcInner.lower.w" :height="arcInner.lower.h" fill="url(#hatchStellite)" stroke="#b03030" stroke-width="1.5" />
          <text :x="arcInner.lower.x + arcInner.lower.w / 2" :y="arcInner.lower.y + arcInner.lower.h / 2 + 4" text-anchor="middle" font-size="11" fill="#8b2020" font-weight="600">司太立</text>

          <path :d="arcInner.rawPath" fill="url(#hatchRaw)" stroke="#3b6ec5" stroke-width="1.5" />
          <text :x="centerX" :y="arcInner.rawCenterY" text-anchor="middle" font-size="12" fill="#2c5282" font-weight="600">生坯</text>

          <g v-if="showDims" class="dimension-group">
            <g>
              <line :x1="arcInner.lower.x - 40" :y1="arcInner.lower.y" :x2="arcInner.lower.x - 40" :y2="arcInner.lower.y + arcInner.lower.h" stroke="#333" stroke-width="0.8" marker-start="url(#arrowStart)" marker-end="url(#arrowEnd)" />
              <text :x="arcInner.lower.x - 45" :y="arcInner.lower.y + arcInner.lower.h / 2 + 3" text-anchor="end" font-size="10" fill="#222" font-weight="500">h₁={{ form.h1.toFixed(1) }}mm</text>
            </g>
            <g>
              <line :x1="arcInner.lower.x - 65" :y1="arcInner.rawBottom" :x2="arcInner.lower.x - 65" :y2="arcInner.rawTop" stroke="#333" stroke-width="0.8" marker-start="url(#arrowStart)" marker-end="url(#arrowEnd)" />
              <text :x="arcInner.lower.x - 70" :y="arcInner.rawCenterY + 3" text-anchor="end" font-size="10" fill="#222" font-weight="500">h={{ form.h.toFixed(1) }}mm</text>
            </g>
            <g>
              <ellipse :cx="centerX" :cy="centerX" :rx="arcInner.R2Mark" :ry="arcInner.R2Mark" fill="none" stroke="#333" stroke-width="0.8" stroke-dasharray="4,2" />
              <text :x="centerX + arcInner.R2Mark + 8" :y="centerX - 5" font-size="10" fill="#222" font-weight="500">R₂={{ form.R2.toFixed(1) }}mm</text>
            </g>
          </g>
        </g>
      </template>

      <template v-else-if="moldType === 'inner_arc_converge'">
        <g>
          <path :d="arcConverge.upperPath" fill="url(#hatchSteel)" stroke="#2c5282" stroke-width="1.5" />
          <rect :x="arcConverge.upperLeft.x" :y="arcConverge.upperLeft.y" :width="arcConverge.upperLeft.w" :height="arcConverge.upperLeft.h" fill="url(#hatch70mn)" stroke="#b8860b" stroke-width="1.2" />
          <rect :x="arcConverge.upperRight.x" :y="arcConverge.upperRight.y" :width="arcConverge.upperRight.w" :height="arcConverge.upperRight.h" fill="url(#hatch70mn)" stroke="#b8860b" stroke-width="1.2" />
          <text :x="centerX" :y="arcConverge.upperTop - 8" text-anchor="middle" font-size="10" fill="#2c5282" font-weight="600">上模体</text>

          <rect :x="arcConverge.lower.x" :y="arcConverge.lower.y" :width="arcConverge.lower.w" :height="arcConverge.lower.h" fill="url(#hatchStellite)" stroke="#b03030" stroke-width="1.5" />
          <text :x="arcConverge.lower.x + arcConverge.lower.w / 2" :y="arcConverge.lower.y + arcConverge.lower.h / 2 + 4" text-anchor="middle" font-size="11" fill="#8b2020" font-weight="600">司太立</text>

          <path :d="arcConverge.rawPath" fill="url(#hatchRaw)" stroke="#3b6ec5" stroke-width="1.5" />
          <text :x="centerX" :y="arcConverge.rawCenterY" text-anchor="middle" font-size="12" fill="#2c5282" font-weight="600">生坯</text>

          <g v-if="showDims" class="dimension-group">
            <g>
              <line :x1="arcConverge.lower.x - 40" :y1="arcConverge.lower.y" :x2="arcConverge.lower.x - 40" :y2="arcConverge.lower.y + arcConverge.lower.h" stroke="#333" stroke-width="0.8" marker-start="url(#arrowStart)" marker-end="url(#arrowEnd)" />
              <text :x="arcConverge.lower.x - 45" :y="arcConverge.lower.y + arcConverge.lower.h / 2 + 3" text-anchor="end" font-size="10" fill="#222" font-weight="500">h₁={{ form.h1.toFixed(1) }}mm</text>
            </g>
            <g>
              <line :x1="arcConverge.lower.x - 65" :y1="arcConverge.rawBottom" :x2="arcConverge.lower.x - 65" :y2="arcConverge.rawTop" stroke="#333" stroke-width="0.8" marker-start="url(#arrowStart)" marker-end="url(#arrowEnd)" />
              <text :x="arcConverge.lower.x - 70" :y="arcConverge.rawCenterY + 3" text-anchor="end" font-size="10" fill="#222" font-weight="500">h={{ form.h.toFixed(1) }}mm</text>
            </g>
          </g>
        </g>
      </template>

      <template v-else-if="moldType === 'outer_arc'">
        <g>
          <path :d="arcOuter.upperPath" fill="url(#hatchSteel)" stroke="#2c5282" stroke-width="1.5" />
          <rect :x="arcOuter.upperLeft.x" :y="arcOuter.upperLeft.y" :width="arcOuter.upperLeft.w" :height="arcOuter.upperLeft.h" fill="url(#hatch70mn)" stroke="#b8860b" stroke-width="1.2" />
          <rect :x="arcOuter.upperRight.x" :y="arcOuter.upperRight.y" :width="arcOuter.upperRight.w" :height="arcOuter.upperRight.h" fill="url(#hatch70mn)" stroke="#b8860b" stroke-width="1.2" />
          <text :x="centerX" :y="arcOuter.upperTop - 8" text-anchor="middle" font-size="10" fill="#2c5282" font-weight="600">上模体</text>

          <rect :x="arcOuter.lower.x" :y="arcOuter.lower.y" :width="arcOuter.lower.w" :height="arcOuter.lower.h" fill="url(#hatchStellite)" stroke="#b03030" stroke-width="1.5" />
          <text :x="arcOuter.lower.x + arcOuter.lower.w / 2" :y="arcOuter.lower.y + arcOuter.lower.h / 2 + 4" text-anchor="middle" font-size="11" fill="#8b2020" font-weight="600">司太立</text>

          <path :d="arcOuter.rawPath" fill="url(#hatchRaw)" stroke="#3b6ec5" stroke-width="1.5" />
          <text :x="centerX" :y="arcOuter.rawCenterY" text-anchor="middle" font-size="12" fill="#2c5282" font-weight="600">生坯</text>

          <g v-if="showDims" class="dimension-group">
            <g>
              <line :x1="arcOuter.lower.x - 40" :y1="arcOuter.lower.y" :x2="arcOuter.lower.x - 40" :y2="arcOuter.lower.y + arcOuter.lower.h" stroke="#333" stroke-width="0.8" marker-start="url(#arrowStart)" marker-end="url(#arrowEnd)" />
              <text :x="arcOuter.lower.x - 45" :y="arcOuter.lower.y + arcOuter.lower.h / 2 + 3" text-anchor="end" font-size="10" fill="#222" font-weight="500">h₁={{ form.h1.toFixed(1) }}mm</text>
            </g>
            <g>
              <line :x1="arcOuter.lower.x - 65" :y1="arcOuter.rawBottom" :x2="arcOuter.lower.x - 65" :y2="arcOuter.rawTop" stroke="#333" stroke-width="0.8" marker-start="url(#arrowStart)" marker-end="url(#arrowEnd)" />
              <text :x="arcOuter.lower.x - 70" :y="arcOuter.rawCenterY + 3" text-anchor="end" font-size="10" fill="#222" font-weight="500">h={{ form.h.toFixed(1) }}mm</text>
            </g>
          </g>
        </g>
      </template>

      <g class="center-lines" v-if="showDims">
        <line :x1="centerX" :y1="marginY" :x2="centerX" :y2="viewBoxHeight - marginY" stroke="#888" stroke-width="0.6" stroke-dasharray="6,4" />
      </g>

      <text :x="viewBoxWidth / 2" y="28" text-anchor="middle" font-size="16" fill="#1a365d" font-weight="700">
        {{ titleText }}
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  form: { type: Object, default: () => ({}) },
  moldType: { type: String, default: 'block' },
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

const centerX = computed(() => viewBoxWidth / 2)

const titleText = computed(() => {
  const titles = {
    block: '方块磁模具磁路截面示意图',
    inner_arc: '内弧磁瓦(常规)模具磁路截面示意图',
    inner_arc_converge: '内弧磁瓦(汇聚)模具磁路截面示意图',
    outer_arc: '外弧磁瓦模具磁路截面示意图'
  }
  return titles[props.moldType] || '模具磁路截面示意图'
})

const scale = computed(() => {
  const availW = viewBoxWidth - marginX * 2 - leftDimSpace - rightSpace
  const availH = viewBoxHeight - marginY * 2 - topSpace - bottomSpace
  
  let totalH = props.form.h1 + props.form.h2 + props.form.h + 20
  let totalW = props.form.w1 + 10
  
  if (props.moldType === 'inner_arc' || props.moldType === 'inner_arc_converge') {
    totalW = props.form.R2 * 2
  } else if (props.moldType === 'outer_arc') {
    totalW = props.form.R2 * 2
  }
  
  return Math.min(availW / totalW, availH / totalH, 8)
})

const block = computed(() => {
  const s = scale.value
  const w1 = props.form.w1 * s
  const w = props.form.w * s
  const h1 = props.form.h1 * s
  const h2 = props.form.h2 * s
  const h = props.form.h * s
  
  const upperY = marginY + topSpace
  const upperX = centerX.value - w1 / 2
  
  const lowerY = upperY + h1 + 12 * s
  const lowerX = centerX.value - w / 2
  
  const rawY = lowerY + h2 + 8 * s
  const rawX = centerX.value - w / 2
  
  return {
    upper: {
      x: upperX, y: upperY, w: w1, h: h1,
      coreX: upperX + 3 * s, coreY: upperY + 5 * s,
      coreW: (props.form.w1 - 6) * s, coreH: (props.form.h1 - 10) * s
    },
    lower: { x: lowerX, y: lowerY, w: w, h: h2 },
    raw: { x: rawX, y: rawY, w: w, h: h }
  }
})

const arcInner = computed(() => {
  const s = scale.value
  const R2 = props.form.R2 * s
  const h1 = props.form.h1 * s
  const h2 = props.form.h2 * s
  const h = props.form.h * s
  
  const centerY = viewBoxHeight / 2
  
  const upperOuterR = R2 + h1 + h + h2 + 15 * s
  const upperInnerR = upperOuterR - h1
  const upperCenterY = centerY - R2 - h / 2
  
  const startAngle = -0.3
  const endAngle = 0.3
  
  const upperStartX = centerX.value + upperOuterR * Math.sin(startAngle)
  const upperStartY = upperCenterY + upperOuterR * Math.cos(startAngle)
  const upperEndX = centerX.value + upperOuterR * Math.sin(endAngle)
  const upperEndY = upperCenterY + upperOuterR * Math.cos(endAngle)
  
  const upperInnerStartX = centerX.value + upperInnerR * Math.sin(startAngle)
  const upperInnerStartY = upperCenterY + upperInnerR * Math.cos(startAngle)
  const upperInnerEndX = centerX.value + upperInnerR * Math.sin(endAngle)
  const upperInnerEndY = upperCenterY + upperInnerR * Math.cos(endAngle)
  
  const upperPath = `M ${upperStartX} ${upperStartY} A ${upperOuterR} ${upperOuterR} 0 0 1 ${upperEndX} ${upperEndY} L ${upperInnerEndX} ${upperInnerEndY} A ${upperInnerR} ${upperInnerR} 0 0 0 ${upperInnerStartX} ${upperInnerStartY} Z`
  
  const rawOuterR = R2 + h
  const rawInnerR = R2
  const rawTop = centerY - R2 - h / 2 + upperInnerR + 10 * s
  const rawBottom = rawTop + h
  
  const rawStartX = centerX.value + rawOuterR * Math.sin(startAngle)
  const rawStartY = rawTop + rawOuterR * Math.cos(startAngle) - upperInnerR - 10 * s + rawOuterR
  const rawEndX = centerX.value + rawOuterR * Math.sin(endAngle)
  const rawEndY = rawTop + rawOuterR * Math.cos(endAngle) - upperInnerR - 10 * s + rawOuterR
  
  const rawPath = `M ${rawStartX} ${rawStartY} A ${rawOuterR} ${rawOuterR} 0 0 1 ${rawEndX} ${rawEndY} L ${centerX.value + R2 * Math.sin(endAngle)} ${rawBottom} L ${centerX.value + R2 * Math.sin(startAngle)} ${rawBottom} A ${R2} ${R2} 0 0 0 ${rawStartX} ${rawStartY}`
  
  return {
    upperCenterY, upperOuterR, upperInnerR, upperPath,
    lower: {
      x: centerX.value - props.form.w * s / 2,
      y: rawBottom + 8 * s,
      w: props.form.w * s, h: h2
    },
    rawPath, rawCenterY: (rawTop + rawBottom) / 2, rawTop, rawBottom,
    R2Mark: R2
  }
})

const arcConverge = computed(() => {
  const s = scale.value
  const R2 = props.form.R2 * s
  const h1 = props.form.h1 * s
  const h = props.form.h * s
  const h3 = (props.form.h3 || 12) * s
  const h4 = (props.form.h4 || 5) * s
  
  const centerY = viewBoxHeight / 2
  const upperTop = marginY + topSpace
  
  const rawTop = upperTop + h3 + h4 + 10 * s
  const rawBottom = rawTop + h
  const lowerY = rawBottom + 8 * s
  
  const arcR = R2 + h / 2
  const arcCenterY = rawTop + h / 2
  
  const startAngle = -0.35
  const endAngle = 0.35
  
  const arcStartX = centerX.value + arcR * Math.sin(startAngle)
  const arcStartY = arcCenterY + arcR * Math.cos(startAngle)
  const arcEndX = centerX.value + arcR * Math.sin(endAngle)
  const arcEndY = arcCenterY + arcR * Math.cos(endAngle)
  
  const upperPath = `M ${arcStartX - 3 * s} ${upperTop} L ${arcStartX} ${arcStartY} A ${arcR} ${arcR} 0 0 1 ${arcEndX} ${arcEndY} L ${arcEndX + 3 * s} ${upperTop} Z`
  
  const rawPath = `M ${arcStartX} ${arcStartY} A ${arcR} ${arcR} 0 0 1 ${arcEndX} ${arcEndY} L ${arcEndX} ${rawBottom} L ${arcStartX} ${rawBottom} Z`
  
  return {
    upperTop, upperPath,
    upperLeft: {
      x: arcStartX - 8 * s, y: upperTop, w: 5 * s, h: h4
    },
    upperRight: {
      x: arcEndX + 3 * s, y: upperTop, w: 5 * s, h: h4
    },
    lower: {
      x: centerX.value - props.form.w * s / 2,
      y: lowerY, w: props.form.w * s, h: h1
    },
    rawPath, rawCenterY: (rawTop + rawBottom) / 2, rawTop, rawBottom
  }
})

const arcOuter = computed(() => {
  const s = scale.value
  const R2 = props.form.R2 * s
  const h1 = props.form.h1 * s
  const h = props.form.h * s
  const h3 = (props.form.h3 || 12) * s
  const h4 = (props.form.h4 || 5) * s
  
  const centerY = viewBoxHeight / 2
  const upperTop = marginY + topSpace
  
  const rawTop = upperTop + h3 + h4 + 10 * s
  const rawBottom = rawTop + h
  const lowerY = rawBottom + 8 * s
  
  const arcR = R2
  const arcCenterY = rawTop + h / 2
  
  const startAngle = -0.35
  const endAngle = 0.35
  
  const arcStartX = centerX.value + arcR * Math.sin(startAngle)
  const arcStartY = arcCenterY + arcR * Math.cos(startAngle)
  const arcEndX = centerX.value + arcR * Math.sin(endAngle)
  const arcEndY = arcCenterY + arcR * Math.cos(endAngle)
  
  const upperPath = `M ${arcStartX - 3 * s} ${upperTop} L ${arcStartX} ${arcStartY} A ${arcR} ${arcR} 0 0 1 ${arcEndX} ${arcEndY} L ${arcEndX + 3 * s} ${upperTop} Z`
  
  const rawOuterR = R2 + h
  const rawStartX = centerX.value + rawOuterR * Math.sin(startAngle)
  const rawStartY = arcCenterY + rawOuterR * Math.cos(startAngle)
  const rawEndX = centerX.value + rawOuterR * Math.sin(endAngle)
  const rawEndY = arcCenterY + rawOuterR * Math.cos(endAngle)
  
  const rawPath = `M ${arcStartX} ${arcStartY} A ${arcR} ${arcR} 0 0 1 ${arcEndX} ${arcEndY} L ${rawEndX} ${rawEndY} A ${rawOuterR} ${rawOuterR} 0 0 0 ${rawStartX} ${rawStartY} Z`
  
  return {
    upperTop, upperPath,
    upperLeft: {
      x: arcStartX - 8 * s, y: upperTop, w: 5 * s, h: h4
    },
    upperRight: {
      x: arcEndX + 3 * s, y: upperTop, w: 5 * s, h: h4
    },
    lower: {
      x: centerX.value - props.form.w * s / 2,
      y: lowerY, w: props.form.w * s, h: h1
    },
    rawPath, rawCenterY: (rawTop + rawBottom) / 2, rawTop, rawBottom
  }
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