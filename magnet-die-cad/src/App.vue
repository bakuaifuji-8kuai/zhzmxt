<template>
  <div class="app-container">
    <el-header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <el-icon :size="28" color="#2c5282"><Setting /></el-icon>
          <h1 class="app-title">瓦磁模具磁路设计系统</h1>
        </div>
        <div class="header-right">
          <span class="doc-ref">QHM-0080-2026 · 一期</span>
        </div>
      </div>
    </el-header>

    <div class="mold-type-bar">
      <div class="type-selector">
        <div
          v-for="mold in moldTypes"
          :key="mold.id"
          class="type-card"
          :class="{ active: currentMoldType === mold.id }"
          @click="changeMoldType(mold.id)"
        >
          <div class="type-icon">{{ mold.icon }}</div>
          <div class="type-name">{{ mold.name }}</div>
          <div class="type-desc">{{ mold.description }}</div>
        </div>
      </div>
    </div>

    <div class="top-toolbar">
      <div class="toolbar-left">
        <div class="tool-group">
          <el-button type="primary" icon="Upload" @click="showImportDialog = true">导入模板图</el-button>
          <el-button type="primary" icon="FolderOpen" @click="showSchemeDialog = true">方案管理</el-button>
          <el-button icon="Download" @click="exportDXF">导出 DXF</el-button>
          <el-button icon="Download" @click="exportSVG">导出 SVG</el-button>
          <el-button icon="Download" @click="exportPNG">导出 PNG</el-button>
          <el-button icon="Download" @click="exportExcel">导出参数表</el-button>
        </div>
        <div class="tool-group">
          <el-button :type="showDims ? 'primary' : 'default'" @click="toggleDims">
            <el-icon><Connection /></el-icon>
            <span>{{ showDims ? '隐藏' : '显示' }}尺寸</span>
          </el-button>
          <el-button @click="saveCurrentScheme">
            <el-icon><Save /></el-icon>
            <span>保存方案</span>
          </el-button>
        </div>
      </div>
      <div class="toolbar-right">
        <el-tag size="small" type="info">比例 {{ scaleText }}</el-tag>
      </div>
    </div>

    <el-container class="main-container">
      <el-aside width="420px" class="param-panel">
        <el-card class="param-card" shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon :size="18" color="#2c5282"><Edit /></el-icon>
              <span class="card-title">参数输入</span>
            </div>
          </template>

          <el-form :model="form" label-width="150px" label-position="right" size="default">
            <div class="param-section-title">生坯参数</div>
            <div class="param-row">
              <el-form-item label="生坯宽度 w (mm)">
                <el-input-number
                  v-model="form.w"
                  :min="0.1"
                  :max="200"
                  :step="0.5"
                  :precision="1"
                  controls-position="right"
                  style="width: 140px"
                  @change="validateParams"
                />
              </el-form-item>
              <el-form-item label="生坯厚度 h (mm)">
                <el-input-number
                  v-model="form.h"
                  :min="0.1"
                  :max="50"
                  :step="0.5"
                  :precision="1"
                  controls-position="right"
                  style="width: 140px"
                  @change="validateParams"
                />
              </el-form-item>
            </div>

            <div v-if="currentMoldType === 'inner_arc' || currentMoldType === 'inner_arc_converge' || currentMoldType === 'outer_arc'" class="param-row">
              <el-form-item label="生坯内径 R2 (mm)">
                <el-input-number
                  v-model="form.R2"
                  :min="0.1"
                  :max="500"
                  :step="0.5"
                  :precision="1"
                  controls-position="right"
                  style="width: 140px"
                  @change="validateParams"
                />
              </el-form-item>
            </div>

            <div class="param-section-title">模具参数</div>
            
            <el-form-item v-if="currentMoldType === 'block'" label="上模不导磁层 h1 (mm)">
              <el-input-number
                v-model="form.h1"
                :disabled="true"
                controls-position="right"
                style="width: 140px"
              />
            </el-form-item>

            <el-form-item v-if="currentMoldType !== 'block'" label="下冲模不导磁层 h1 (mm)">
              <el-input-number
                v-model="form.h1"
                :min="1"
                :max="50"
                :step="0.5"
                :precision="1"
                controls-position="right"
                style="width: 140px"
              />
            </el-form-item>

            <el-form-item label="下冲模不导磁层 h2 (mm)">
              <div class="auto-field">
                <el-input-number
                  v-model="form.h2"
                  :min="0.1"
                  :max="50"
                  :step="0.5"
                  :precision="1"
                  :disabled="autoH2"
                  controls-position="right"
                  style="width: 110px"
                />
                <el-checkbox v-model="autoH2" size="small" style="margin-left: 8px">自动计算</el-checkbox>
              </div>
            </el-form-item>

            <el-form-item v-if="currentMoldType === 'block'" label="上模45#钢宽 w1 (mm)">
              <el-input-number
                v-model="form.w1"
                :min="0.1"
                :max="220"
                :step="0.5"
                :precision="1"
                controls-position="right"
                style="width: 140px"
                @change="validateParams"
              />
              <div class="param-hint">
                <el-icon :size="12" color="#999"><InfoFilled /></el-icon>
                <span>不含两侧3mm不导磁层</span>
              </div>
            </el-form-item>

            <el-form-item v-if="currentMoldType === 'inner_arc_converge' || currentMoldType === 'outer_arc'" label="上模不导磁层宽度 w1 (mm)">
              <el-input-number
                v-model="form.w1"
                :disabled="true"
                controls-position="right"
                style="width: 140px"
              />
            </el-form-item>

            <div v-if="currentMoldType === 'inner_arc_converge' || currentMoldType === 'outer_arc'" class="param-row">
              <el-form-item label="上模弧顶厚度 h3 (mm)">
                <el-input-number
                  v-model="form.h3"
                  :disabled="true"
                  controls-position="right"
                  style="width: 140px"
                />
              </el-form-item>
              <el-form-item label="上模两侧高度 h4 (mm)">
                <el-input-number
                  v-model="form.h4"
                  :disabled="true"
                  controls-position="right"
                  style="width: 140px"
                />
              </el-form-item>
            </div>

            <div v-if="currentMoldType === 'inner_arc' || currentMoldType === 'inner_arc_converge'" class="param-row">
              <el-form-item label="下冲模台阶半径 R3 (mm)">
                <el-input-number
                  v-model="form.R3"
                  :disabled="true"
                  controls-position="right"
                  style="width: 140px"
                />
              </el-form-item>
              <el-form-item label="下冲模小圆角 R4 (mm)">
                <el-input-number
                  v-model="form.R4"
                  :disabled="true"
                  controls-position="right"
                  style="width: 140px"
                />
              </el-form-item>
            </div>

            <div v-if="currentMoldType === 'inner_arc_converge'" class="param-row">
              <el-form-item label="下冲模圆角 R1 (mm)">
                <el-input-number
                  v-model="form.R1"
                  :disabled="true"
                  controls-position="right"
                  style="width: 140px"
                />
              </el-form-item>
            </div>

            <div class="param-section-title">模腔配置</div>
            <div class="param-row">
              <el-form-item label="模腔数量">
                <el-input-number
                  v-model="form.cavityCount"
                  :min="1"
                  :max="20"
                  :step="1"
                  controls-position="right"
                  style="width: 140px"
                />
              </el-form-item>
              <el-form-item label="模腔间距 (mm)">
                <el-input-number
                  v-model="form.cavityGap"
                  :min="0"
                  :max="50"
                  :step="0.5"
                  :precision="1"
                  controls-position="right"
                  style="width: 140px"
                />
              </el-form-item>
            </div>
          </el-form>

          <div v-if="validationErrors.length > 0" class="validation-errors">
            <el-alert
              v-for="(error, idx) in validationErrors"
              :key="idx"
              :title="error"
              type="error"
              :closable="false"
              show-icon
              style="margin-bottom: 4px"
            />
          </div>
        </el-card>

        <el-card class="result-card" shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon :size="18" color="#2c5282"><DataAnalysis /></el-icon>
              <span class="card-title">磁场计算结果</span>
            </div>
          </template>

          <div class="magnetic-cards">
            <div class="magnetic-card">
              <div class="magnetic-label">上模面中心磁场</div>
              <div class="magnetic-value">{{ magnetic.upperCenter.toFixed(1) }}<span class="unit">mT</span></div>
            </div>
            <div class="magnetic-card">
              <div class="magnetic-label">下冲模面中心磁场</div>
              <div class="magnetic-value">{{ magnetic.lowerCenter.toFixed(1) }}<span class="unit">mT</span></div>
            </div>
          </div>

          <div class="stats-row">
            <div class="stat-box">
              <span class="stat-value">{{ airGap.toFixed(1) }}</span>
              <span class="stat-label">气隙长度(mm)</span>
            </div>
            <div class="stat-box">
              <span class="stat-value">{{ area.toFixed(1) }}</span>
              <span class="stat-label">生坯截面积(mm²)</span>
            </div>
          </div>

          <div class="verify-box" :class="verifyResult.pass ? 'pass' : 'fail'">
            <div class="verify-icon">
              <el-icon v-if="verifyResult.pass" :size="20" color="#38a169"><CircleCheck /></el-icon>
              <el-icon v-else :size="20" color="#e53e3e"><Warning /></el-icon>
            </div>
            <div class="verify-text">
              <div class="verify-title">{{ verifyResult.pass ? '验证通过' : '验证不通过' }}</div>
              <div class="verify-detail">{{ verifyResult.message }}</div>
            </div>
          </div>
        </el-card>
      </el-aside>

      <el-main class="viewer-panel">
        <el-card class="viewer-card" shadow="never">
          <template #header>
            <div class="card-header viewer-header">
              <el-icon :size="18" color="#2c5282"><Picture /></el-icon>
              <span class="card-title">{{ tabNames[activeTab] }}</span>
              <div class="view-tabs">
                <el-tabs v-model="activeTab" type="border-card" class="inline-tabs">
                  <el-tab-pane label="2D 截面图" name="2d" />
                  <el-tab-pane label="3D 视图" name="3d" />
                  <el-tab-pane label="取向图" name="orientation" />
                </el-tabs>
              </div>
            </div>
          </template>

          <div class="viewer-container">
            <CrossSectionView
              v-if="activeTab === '2d'"
              ref="crossSectionRef"
              :form="form"
              :mold-type="currentMoldType"
              :show-dims="showDims"
            />
            <DieView3D
              v-else-if="activeTab === '3d'"
              ref="dieView3DRef"
              :form="form"
              :mold-type="currentMoldType"
            />
            <OrientationView
              v-else-if="activeTab === 'orientation'"
              :form="form"
              :mold-type="currentMoldType"
            />
          </div>

          <div class="legend-bar" v-if="activeTab === '2d'">
            <div class="legend-item">
              <span class="legend-color legend-steel"></span>
              <span class="legend-label">45#钢</span>
            </div>
            <div class="legend-item">
              <span class="legend-color legend-nonmag"></span>
              <span class="legend-label">不导磁层(70Mn)</span>
            </div>
            <div class="legend-item">
              <span class="legend-color legend-stellite"></span>
              <span class="legend-label">司太立</span>
            </div>
            <div class="legend-item">
              <span class="legend-color legend-raw"></span>
              <span class="legend-label">生坯</span>
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>

    <el-dialog v-model="showImportDialog" title="导入模板图" width="400px" destroy-on-close>
      <TemplateImporter @apply="handleImportApply" />
      <template #footer>
        <el-button @click="showImportDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showSchemeDialog" title="方案管理" width="500px" destroy-on-close>
      <SchemeManager @load="loadScheme" @delete="deleteScheme" />
      <template #footer>
        <el-button @click="showSchemeDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import CrossSectionView from './components/CrossSectionView.vue'
import DieView3D from './components/DieView3D.vue'
import OrientationView from './components/OrientationView.vue'
import TemplateImporter from './components/TemplateImporter.vue'
import SchemeManager from './components/SchemeManager.vue'
import { generateDXF, downloadDXF } from './utils/dxfGenerator.js'
import { calculateMagneticField, verifyDesign } from './utils/magneticField.js'

const crossSectionRef = ref(null)
const dieView3DRef = ref(null)

const activeTab = ref('2d')
const showImportDialog = ref(false)
const showSchemeDialog = ref(false)
const showDims = ref(true)
const autoH2 = ref(true)

const currentMoldType = ref(localStorage.getItem('lastMoldType') || 'block')

const moldTypes = [
  { id: 'block', name: '方块磁模具', description: '平行取向', icon: '▣' },
  { id: 'inner_arc', name: '内弧磁瓦(常规)', description: '径向取向', icon: '⌒' },
  { id: 'inner_arc_converge', name: '内弧磁瓦(汇聚)', description: '汇聚/洗衣机取向', icon: '◡' },
  { id: 'outer_arc', name: '外弧磁瓦', description: '常规/8P取向', icon: '◠' }
]

const tabNames = {
  '2d': '截面图预览',
  '3d': '3D 模具结构',
  'orientation': '横截面取向图'
}

const form = reactive({
  w: 40,
  h: 15,
  h1: 33,
  h2: 6,
  w1: 40,
  NI: 8000,
  R2: 50,
  R3: 44,
  R4: 3,
  R1: 20,
  h3: 12,
  h4: 5,
  cavityCount: 1,
  cavityGap: 10
})

const validationErrors = ref([])

function initFormByMold(type) {
  Object.keys(form).forEach(key => {
    if (key === 'cavityCount') form[key] = 1
    else if (key === 'cavityGap') form[key] = 10
    else form[key] = 0
  })

  switch (type) {
    case 'block':
      form.w = 40
      form.h = 15
      form.h1 = 33
      form.w1 = 40
      form.NI = 8000
      break
    case 'inner_arc':
      form.w = 50
      form.h = 10
      form.h1 = 6
      form.R2 = 50
      form.R3 = 44
      form.R4 = 3
      break
    case 'inner_arc_converge':
      form.w = 60
      form.h = 12
      form.h1 = 6
      form.R2 = 60
      form.R3 = 54
      form.R4 = 3
      form.R1 = 20
      form.h3 = 12
      form.h4 = 5
      form.w1 = 70
      break
    case 'outer_arc':
      form.w = 45
      form.h = 10
      form.h1 = 6
      form.R2 = 50
      form.R3 = 56
      form.h3 = 12
      form.h4 = 5
      form.w1 = 55
      break
  }
  autoH2.value = true
  updateAutoCalculated()
}

function updateAutoCalculated() {
  if (autoH2.value) {
    if (currentMoldType.value === 'block') {
      if (form.h < 9) form.h2 = 3
      else if (form.h <= 29.5) form.h2 = 6
      else form.h2 = 8
    } else if (currentMoldType.value === 'inner_arc') {
      form.h2 = Math.floor(form.h1 * 1.35 - 1.83)
      if (form.h2 < 1) form.h2 = 1
    } else if (currentMoldType.value === 'inner_arc_converge') {
      form.h2 = Math.floor(form.h1 * 3.47)
      if (form.h2 < 1) form.h2 = 1
      form.w1 = Math.floor(form.w + 10)
      form.R3 = form.R2 - form.h1
    } else if (currentMoldType.value === 'outer_arc') {
      form.w1 = Math.floor(form.w + 10)
      form.R3 = form.R2 + form.h1
    }
  }
}

function changeMoldType(type) {
  if (currentMoldType.value === type) return
  ElMessageBox.confirm(
    '切换模具类型将清空当前参数，是否继续？',
    '确认切换',
    { type: 'warning' }
  ).then(() => {
    currentMoldType.value = type
    localStorage.setItem('lastMoldType', type)
    initFormByMold(type)
    validateParams()
  }).catch(() => {})
}

function validateParams() {
  validationErrors.value = []
  
  if (form.w <= 0) validationErrors.value.push('生坯宽度必须大于 0')
  if (form.h <= 0) validationErrors.value.push('生坯厚度必须大于 0')
  
  if (currentMoldType.value === 'block') {
    if (form.h > 29.5) {
      validationErrors.value.push('生坯厚度超过29.5mm，超出QHM-0080-2026规范推荐范围')
    }
  }
  
  if ((currentMoldType.value === 'inner_arc' || currentMoldType.value === 'inner_arc_converge') && form.R2 <= 0) {
    validationErrors.value.push('生坯内径必须大于 0')
  }
  
  if (currentMoldType.value === 'inner_arc' && form.h < 6) {
    validationErrors.value.push('生坯厚度应在6~32.5mm范围内')
  }
  if (currentMoldType.value === 'inner_arc' && form.h > 32.5) {
    validationErrors.value.push('生坯厚度超过32.5mm，超出规范范围')
  }
}

watch(
  () => form.h,
  () => {
    updateAutoCalculated()
    validateParams()
  }
)

watch(
  () => form.h1,
  () => {
    updateAutoCalculated()
  }
)

watch(
  () => form.w,
  () => {
    updateAutoCalculated()
    validateParams()
  }
)

watch(
  () => form.R2,
  () => {
    updateAutoCalculated()
    validateParams()
  }
)

watch(activeTab, (tab) => {
  if (tab === '3d') {
    setTimeout(() => {
      dieView3DRef.value?.reinit()
    }, 300)
  }
})

const airGap = computed(() => {
  return 2
})

const area = computed(() => {
  return form.w * form.h
})

const magnetic = computed(() => {
  return calculateMagneticField(form)
})

const verifyResult = computed(() => {
  return verifyDesign(form, magnetic.value)
})

const scaleText = computed(() => {
  let maxDim = form.w
  if (currentMoldType.value === 'block') {
    maxDim = Math.max(form.w1 + 6, form.h1 + form.h2 + form.h + 20)
  } else if (form.R2) {
    maxDim = Math.max(form.R2 * 2, form.h1 + form.h2 + form.h + 20)
  }
  if (maxDim < 50) return '2:1'
  if (maxDim < 100) return '1:1'
  if (maxDim < 200) return '1:2'
  return '1:3'
})

function handleImportApply(params) {
  Object.keys(params).forEach(key => {
    if (form.hasOwnProperty(key) && params[key] !== undefined) {
      form[key] = params[key]
    }
  })
  updateAutoCalculated()
  validateParams()
  showImportDialog.value = false
}

function saveCurrentScheme() {
  const scheme = {
    id: Date.now().toString(),
    name: `方案_${currentMoldType.value}_${form.w}x${form.h}`,
    moldType: currentMoldType.value,
    form: { ...form },
    createdAt: new Date().toLocaleString()
  }
  
  const schemes = JSON.parse(localStorage.getItem('magnetSchemes') || '[]')
  schemes.push(scheme)
  localStorage.setItem('magnetSchemes', JSON.stringify(schemes))
  
  ElMessage.success('方案保存成功')
}

function loadScheme(scheme) {
  currentMoldType.value = scheme.moldType
  Object.keys(scheme.form).forEach(key => {
    if (form.hasOwnProperty(key)) {
      form[key] = scheme.form[key]
    }
  })
  localStorage.setItem('lastMoldType', scheme.moldType)
  validateParams()
  showSchemeDialog.value = false
  ElMessage.success('方案加载成功')
}

function deleteScheme(id) {
  ElMessageBox.confirm(
    '确定删除该方案吗？',
    '确认删除',
    { type: 'warning' }
  ).then(() => {
    let schemes = JSON.parse(localStorage.getItem('magnetSchemes') || '[]')
    schemes = schemes.filter(s => s.id !== id)
    localStorage.setItem('magnetSchemes', JSON.stringify(schemes))
    ElMessage.success('删除成功')
  })
}

function exportDXF() {
  const dxfContent = generateDXF(form, currentMoldType.value)
  const filename = `模具截面_${currentMoldType.value}_w${form.w}_h${form.h}.dxf`
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
  a.download = `模具截面_${currentMoldType.value}_w${form.w}_h${form.h}.svg`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function exportPNG() {
  const svgEl = document.querySelector('.section-svg')
  if (!svgEl) return
  
  const svgData = new XMLSerializer().serializeToString(svgEl)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `模具截面_${currentMoldType.value}_w${form.w}_h${form.h}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 'image/png')
  }
  
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
}

function exportExcel() {
  const headers = ['参数符号', '参数名称', '类型', '单位', '当前值']
  const params = []
  
  switch (currentMoldType.value) {
    case 'block':
      params.push(['w', '生坯宽度', '用户输入', 'mm', form.w])
      params.push(['h', '生坯厚度', '用户输入', 'mm', form.h])
      params.push(['h1', '上模不导磁层高度', '固定', 'mm', form.h1])
      params.push(['w1', '上模45#钢宽度', '用户输入', 'mm', form.w1])
      params.push(['h2', '下冲模不导磁层厚度', '自动计算', 'mm', form.h2])
      break
    case 'inner_arc':
      params.push(['w', '生坯宽度(弧长)', '用户输入', 'mm', form.w])
      params.push(['h', '生坯厚度', '用户输入', 'mm', form.h])
      params.push(['R2', '生坯内径', '用户输入', 'mm', form.R2])
      params.push(['h1', '下冲模不导磁层高度', '固定', 'mm', form.h1])
      params.push(['h2', '下冲模不导磁层厚度', '自动计算', 'mm', form.h2])
      params.push(['R3', '下冲模台阶半径', '自动计算', 'mm', form.R3])
      params.push(['R4', '下冲模小圆角', '固定', 'mm', form.R4])
      break
    case 'inner_arc_converge':
      params.push(['w', '生坯宽度(弧长)', '用户输入', 'mm', form.w])
      params.push(['h', '生坯厚度', '用户输入', 'mm', form.h])
      params.push(['R2', '生坯内径', '用户输入', 'mm', form.R2])
      params.push(['h1', '下冲模不导磁层高度', '固定', 'mm', form.h1])
      params.push(['h2', '下冲模不导磁层厚度', '自动计算', 'mm', form.h2])
      params.push(['h3', '上模弧顶厚度', '固定', 'mm', form.h3])
      params.push(['h4', '上模两侧高度', '固定', 'mm', form.h4])
      params.push(['w1', '上模不导磁层宽度', '自动计算', 'mm', form.w1])
      params.push(['R3', '下冲模台阶半径', '自动计算', 'mm', form.R3])
      params.push(['R4', '下冲模小圆角', '固定', 'mm', form.R4])
      params.push(['R1', '下冲模圆角', '固定', 'mm', form.R1])
      break
    case 'outer_arc':
      params.push(['w', '生坯宽度(弧长)', '用户输入', 'mm', form.w])
      params.push(['h', '生坯厚度', '用户输入', 'mm', form.h])
      params.push(['R2', '生坯内径', '用户输入', 'mm', form.R2])
      params.push(['h1', '下冲模不导磁层高度', '固定', 'mm', form.h1])
      params.push(['h2', '下冲模不导磁层厚度', '自动计算', 'mm', form.h2])
      params.push(['h3', '上模弧顶厚度', '固定', 'mm', form.h3])
      params.push(['h4', '上模两侧高度', '固定', 'mm', form.h4])
      params.push(['w1', '上模不导磁层宽度', '自动计算', 'mm', form.w1])
      params.push(['R3', '下冲模台阶半径', '自动计算', 'mm', form.R3])
      break
  }
  
  params.push(['cavityCount', '模腔数量', '用户输入', '个', form.cavityCount])
  params.push(['cavityGap', '模腔间距', '用户输入', 'mm', form.cavityGap])
  
  let csv = headers.join('\t') + '\n'
  params.forEach(row => {
    csv += row.join('\t') + '\n'
  })
  
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `模具参数_${currentMoldType.value}_w${form.w}_h${form.h}.xls`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function toggleDims() {
  showDims.value = !showDims.value
}

initFormByMold(currentMoldType.value)
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
  height: 56px;
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

.mold-type-bar {
  height: 90px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  padding: 10px 20px;
}

.type-selector {
  display: flex;
  gap: 16px;
  overflow-x: auto;
}

.type-card {
  flex: 0 0 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
}

.type-card:hover {
  border-color: #90cdf4;
  background: #f0f7ff;
}

.type-card.active {
  border-color: #2c5282;
  background: #ebf8ff;
}

.type-icon {
  font-size: 24px;
  color: #2c5282;
  margin-bottom: 6px;
}

.type-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.type-desc {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

.top-toolbar {
  height: 48px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.toolbar-left {
  display: flex;
  gap: 16px;
}

.tool-group {
  display: flex;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.main-container {
  flex: 1;
  overflow: hidden;
  padding: 12px;
  gap: 12px;
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
.result-card :deep(.el-card__body) {
  padding: 16px;
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

.param-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #2c5282;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e2e8f0;
}

.param-row {
  display: flex;
  gap: 16px;
  margin-bottom: 4px;
}

.param-row :deep(.el-form-item) {
  margin-bottom: 12px;
  flex: 1;
}

.auto-field {
  display: flex;
  align-items: center;
}

.param-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

.validation-errors {
  margin-top: 12px;
}

.magnetic-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
}

.magnetic-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: linear-gradient(135deg, #ebf8ff 0%, #f0f7ff 100%);
  border-radius: 8px;
  border-left: 4px solid #3182ce;
}

.magnetic-card .magnetic-label {
  font-size: 13px;
  color: #555;
}

.magnetic-card .magnetic-value {
  font-size: 22px;
  font-weight: 700;
  color: #2c5282;
  font-family: 'Consolas', monospace;
}

.magnetic-card .magnetic-value .unit {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  margin-left: 4px;
}

.stats-row {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.stat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.stat-box .stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #1a365d;
  font-family: 'Consolas', monospace;
}

.stat-box .stat-label {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

.verify-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
}

.verify-box.pass {
  background: #f0fff4;
  border: 1px solid #9ae6b4;
}

.verify-box.fail {
  background: #fff5f5;
  border: 1px solid #feb2b2;
}

.verify-icon {
  display: flex;
  align-items: center;
  margin-top: 2px;
}

.verify-text {
  flex: 1;
}

.verify-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.verify-box.pass .verify-title {
  color: #38a169;
}

.verify-box.fail .verify-title {
  color: #e53e3e;
}

.verify-detail {
  font-size: 11px;
  line-height: 1.5;
  color: #666;
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

.view-tabs {
  flex: 1;
  margin-left: 20px;
}

.inline-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
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
  gap: 20px;
  padding: 10px 0 4px;
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
  width: 16px;
  height: 16px;
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

.legend-nonmag {
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
  background-size: 4px 4px;
}
</style>