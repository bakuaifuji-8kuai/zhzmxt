<template>
  <div class="app-container">
    <el-header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <el-icon :size="28" color="#2c5282"><Setting /></el-icon>
          <h1 class="app-title">方块磁模具磁路设计工具</h1>
        </div>
        <div class="header-right">
          <span class="doc-ref">QHM-0080-2026 · 第7部分</span>
        </div>
      </div>
    </el-header>

    <el-container class="main-container">
      <el-aside width="360px" class="param-panel">
        <el-card class="param-card" shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon :size="18" color="#2c5282"><Edit /></el-icon>
              <span class="card-title">参数输入</span>
            </div>
          </template>

          <el-form :model="form" label-width="140px" label-position="right" size="default">
            <el-form-item label="生坯宽度 w (mm)">
              <el-input-number
                v-model="form.w"
                :min="5"
                :max="200"
                :step="0.5"
                :precision="1"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="生坯厚度 h (mm)">
              <el-input-number
                v-model="form.h"
                :min="2"
                :max="80"
                :step="0.5"
                :precision="1"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>

            <el-divider content-position="left">
              <span class="divider-text">模具参数</span>
            </el-divider>

            <el-form-item label="上模不导磁层 h1 (mm)">
              <el-input-number
                v-model="form.h1"
                :min="10"
                :max="100"
                :step="1"
                :precision="1"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="下冲模不导磁层 h2 (mm)">
              <div class="auto-field">
                <el-input-number
                  v-model="form.h2"
                  :min="1"
                  :max="30"
                  :step="0.5"
                  :precision="1"
                  :disabled="autoH2"
                  controls-position="right"
                  style="width: 100%"
                />
                <el-checkbox v-model="autoH2" class="auto-checkbox">自动</el-checkbox>
              </div>
            </el-form-item>

            <el-form-item label="上模不导磁层宽 w1 (mm)">
              <div class="auto-field">
                <el-input-number
                  v-model="form.w1"
                  :min="8"
                  :max="220"
                  :step="0.5"
                  :precision="1"
                  :disabled="autoW1"
                  controls-position="right"
                  style="width: 100%"
                />
                <el-checkbox v-model="autoW1" class="auto-checkbox">自动</el-checkbox>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="resetParams" style="width: 100%">
                <el-icon><Refresh /></el-icon>
                <span style="margin-left: 6px">重置参数</span>
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="result-card" shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon :size="18" color="#2c5282"><DataAnalysis /></el-icon>
              <span class="card-title">磁场计算结果</span>
            </div>
          </template>

          <div class="result-list">
            <div class="result-item">
              <span class="result-label">上模面中心磁场</span>
              <span class="result-value">{{ magnetic.upperCenter.toFixed(1) }} mT</span>
            </div>
            <div class="result-item">
              <span class="result-label">下冲模面中心磁场</span>
              <span class="result-value">{{ magnetic.lowerCenter.toFixed(1) }} mT</span>
            </div>
            <div class="result-item">
              <span class="result-label">气隙长度</span>
              <span class="result-value">{{ airGap.toFixed(1) }} mm</span>
            </div>
            <div class="result-item">
              <span class="result-label">生坯截面积</span>
              <span class="result-value">{{ area.toFixed(1) }} mm²</span>
            </div>
          </div>

          <el-alert
            title="说明"
            type="info"
            :closable="false"
            show-icon
            class="info-alert"
          >
            <template #default>
              <span style="font-size: 12px; line-height: 1.6">
                磁场值为参考估算值，实际磁场强度需根据材料牌号、充磁电流等参数通过有限元分析精确计算。
              </span>
            </template>
          </el-alert>
        </el-card>

        <el-card class="export-card" shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon :size="18" color="#2c5282"><Download /></el-icon>
              <span class="card-title">导出</span>
            </div>
          </template>

          <div class="export-buttons">
            <el-button type="success" @click="exportDXF" style="width: 100%">
              <el-icon><Picture /></el-icon>
              <span style="margin-left: 6px">导出 DXF 格式</span>
            </el-button>
            <el-button @click="exportSVG" style="width: 100%">
              <el-icon><Picture /></el-icon>
              <span style="margin-left: 6px">导出 SVG 格式</span>
            </el-button>
            <el-button @click="toggleDims" style="width: 100%">
              <el-icon><Ruler /></el-icon>
              <span style="margin-left: 6px">{{ showDims ? '隐藏' : '显示' }}尺寸标注</span>
            </el-button>
          </div>
        </el-card>
      </el-aside>

      <el-main class="viewer-panel">
        <el-card class="viewer-card" shadow="never">
          <template #header>
            <div class="card-header viewer-header">
              <el-icon :size="18" color="#2c5282"><Picture /></el-icon>
              <span class="card-title">截面图预览</span>
              <div class="viewer-actions">
                <el-tag size="small" type="info">比例 {{ scaleText }}</el-tag>
              </div>
            </div>
          </template>

          <div class="viewer-container">
            <CrossSectionView
              ref="crossSectionRef"
              :w="form.w"
              :h="form.h"
              :h1="form.h1"
              :h2="form.h2"
              :w1="form.w1"
              :show-dims="showDims"
            />
          </div>

          <div class="legend-bar">
            <div class="legend-item">
              <span class="legend-color legend-steel"></span>
              <span class="legend-label">上模体 (模具钢)</span>
            </div>
            <div class="legend-item">
              <span class="legend-color legend-70mn"></span>
              <span class="legend-label">70Mn 不导磁层</span>
            </div>
            <div class="legend-item">
              <span class="legend-color legend-stellite"></span>
              <span class="legend-label">司太立不导磁层</span>
            </div>
            <div class="legend-item">
              <span class="legend-color legend-raw"></span>
              <span class="legend-label">生坯</span>
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import CrossSectionView from './components/CrossSectionView.vue'
import { generateDXF, downloadDXF } from './utils/dxfGenerator.js'

const crossSectionRef = ref(null)

const form = ref({
  w: 40,
  h: 15,
  h1: 33,
  h2: 6,
  w1: 46
})

const autoH2 = ref(true)
const autoW1 = ref(true)
const showDims = ref(true)

watch(
  () => form.value.h,
  (newH) => {
    if (autoH2.value) {
      if (newH < 9) {
        form.value.h2 = 3
      } else if (newH <= 29.5) {
        form.value.h2 = 6
      } else {
        form.value.h2 = 8
      }
    }
  },
  { immediate: true }
)

watch(
  () => form.value.w,
  (newW) => {
    if (autoW1.value) {
      form.value.w1 = Number((newW + 6).toFixed(1))
    }
  },
  { immediate: true }
)

const airGap = computed(() => {
  return 2
})

const area = computed(() => {
  return form.value.w * form.value.h
})

const magnetic = computed(() => {
  const baseField = 800
  const gapFactor = Math.max(0.3, 1 - (airGap.value - 1) * 0.1)
  const areaFactor = Math.min(1.2, 1000 / Math.max(area.value, 100))
  return {
    upperCenter: baseField * gapFactor * areaFactor,
    lowerCenter: baseField * gapFactor * areaFactor * 0.95
  }
})

const scaleText = computed(() => {
  const maxDim = Math.max(form.value.w1, form.value.h1 + form.value.h2 + form.value.h + 20)
  if (maxDim < 50) return '2:1'
  if (maxDim < 100) return '1:1'
  if (maxDim < 200) return '1:2'
  return '1:3'
})

function resetParams() {
  form.value = {
    w: 40,
    h: 15,
    h1: 33,
    h2: 6,
    w1: 46
  }
  autoH2.value = true
  autoW1.value = true
}

function exportDXF() {
  const dxfContent = generateDXF(form.value)
  const filename = `方块磁模具截面_w${form.value.w}_h${form.value.h}.dxf`
  downloadDXF(filename, dxfContent)
}

function exportSVG() {
  const svgEl = document.querySelector('.section-svg')
  if (!svgEl) return
  const svgData = new XMLSerializer().serializeToString(svgEl)
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `方块磁模具截面_w${form.value.w}_h${form.value.h}.svg`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function toggleDims() {
  showDims.value = !showDims.value
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  background: #f0f2f5;
  color: #333;
}
</style>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  height: 60px;
  background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
}

.doc-ref {
  font-size: 13px;
  opacity: 0.85;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
}

.main-container {
  flex: 1;
  overflow: hidden;
  padding: 16px;
  gap: 16px;
}

.param-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 4px;
}

.param-panel::-webkit-scrollbar {
  width: 6px;
}

.param-panel::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.param-card :deep(.el-card__body),
.result-card :deep(.el-card__body),
.export-card :deep(.el-card__body) {
  padding: 16px 18px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a365d;
}

.divider-text {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.auto-field {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.auto-checkbox {
  white-space: nowrap;
  font-size: 12px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border-left: 3px solid #2c5282;
}

.result-label {
  font-size: 13px;
  color: #555;
}

.result-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a365d;
  font-family: 'Consolas', monospace;
}

.info-alert {
  margin-top: 8px;
}

.export-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.viewer-panel {
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.viewer-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.viewer-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 12px;
}

.viewer-header {
  justify-content: space-between;
}

.viewer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.viewer-container {
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  min-height: 0;
}

.legend-bar {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 12px 0 4px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #555;
}

.legend-color {
  width: 18px;
  height: 18px;
  border: 1px solid #999;
  border-radius: 2px;
}

.legend-steel {
  background: repeating-linear-gradient(
    45deg,
    #bcd0e8,
    #bcd0e8 2px,
    #fff 2px,
    #fff 4px
  );
  border-color: #2c5282;
}

.legend-70mn {
  background: repeating-linear-gradient(
    45deg,
    #e8c87a,
    #e8c87a 2px,
    #fff 2px,
    #fff 4px
  );
  border-color: #b8860b;
}

.legend-stellite {
  background: repeating-linear-gradient(
    -45deg,
    #e8a0a0,
    #e8a0a0 2px,
    #fff 2px,
    #fff 4px
  );
  border-color: #b03030;
}

.legend-raw {
  background: #e8f0fe;
  border-color: #3b6ec5;
  position: relative;
}

.legend-raw::before,
.legend-raw::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent 45%, #7aa3e5 45%, #7aa3e5 55%, transparent 55%),
              linear-gradient(-45deg, transparent 45%, #7aa3e5 45%, #7aa3e5 55%, transparent 55%);
  background-size: 5px 5px;
}
</style>
