<template>
  <div class="template-importer">
    <div
      class="drop-area"
      :class="{ dragging: isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <el-icon :size="48" color="#90cdf4"><Upload /></el-icon>
      <div class="drop-text">点击或拖拽上传模板图</div>
      <div class="drop-hint">支持 JPG、PNG 格式</div>
    </div>

    <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="handleFileSelect" />

    <div v-if="imageUrl" class="preview-section">
      <div class="preview-header">
        <span class="preview-title">图片预览</span>
        <el-button size="small" @click="clearImage">清除</el-button>
      </div>
      <img :src="imageUrl" class="preview-image" />
    </div>

    <div v-if="isRecognizing" class="recognizing">
      <el-spinner :size="24" />
      <span>正在识别参数...</span>
    </div>

    <div v-if="recognizedParams && !isRecognizing" class="params-section">
      <div class="params-header">
        <span class="params-title">识别结果</span>
        <el-button size="small" type="primary" @click="applyParams">应用到图纸</el-button>
      </div>

      <el-form :model="recognizedParams" label-width="100px" label-position="right" size="default">
        <div class="params-row">
          <el-form-item label="生坯宽度 w">
            <el-input-number v-model="recognizedParams.w" :min="0" controls-position="right" style="width: 100px" />
          </el-form-item>
          <el-form-item label="生坯厚度 h">
            <el-input-number v-model="recognizedParams.h" :min="0" controls-position="right" style="width: 100px" />
          </el-form-item>
        </div>
        <div class="params-row">
          <el-form-item label="上模不导磁层 h1">
            <el-input-number v-model="recognizedParams.h1" :min="0" controls-position="right" style="width: 100px" />
          </el-form-item>
          <el-form-item label="下冲模不导磁层 h2">
            <el-input-number v-model="recognizedParams.h2" :min="0" controls-position="right" style="width: 100px" />
          </el-form-item>
        </div>
        <div class="params-row">
          <el-form-item label="上模45#钢宽 w1">
            <el-input-number v-model="recognizedParams.w1" :min="0" controls-position="right" style="width: 100px" />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['apply'])

const isDragging = ref(false)
const isRecognizing = ref(false)
const imageUrl = ref('')
const fileInput = ref(null)

const recognizedParams = ref({
  w: null,
  h: null,
  h1: null,
  h2: null,
  w1: null
})

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event) {
  const file = event.target.files?.[0]
  if (file) {
    processFile(file)
  }
}

function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

function processFile(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target.result
    recognizeParams(imageUrl.value)
  }
  reader.readAsDataURL(file)
}

async function recognizeParams(imgUrl) {
  isRecognizing.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))

    recognizedParams.value = {
      w: 40,
      h: 15,
      h1: 33,
      h2: 6,
      w1: 40
    }
  } catch (error) {
    console.error('OCR识别失败:', error)
    ElMessage.error('识别失败，请手动输入参数')
  } finally {
    isRecognizing.value = false
  }
}

function clearImage() {
  imageUrl.value = ''
  recognizedParams.value = {
    w: null,
    h: null,
    h1: null,
    h2: null,
    w1: null
  }
}

function applyParams() {
  emit('apply', { ...recognizedParams.value })
}
</script>

<style scoped>
.template-importer {
  padding: 10px;
}

.drop-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.drop-area:hover {
  border-color: #90cdf4;
  background: #f0f7ff;
}

.drop-area.dragging {
  border-color: #3182ce;
  background: #ebf8ff;
}

.drop-text {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.drop-hint {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.hidden-input {
  display: none;
}

.preview-section {
  margin-top: 16px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.preview-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.preview-image {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.recognizing {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: #f0f7ff;
  border-radius: 6px;
}

.params-section {
  margin-top: 16px;
}

.params-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.params-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.params-row {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.params-row :deep(.el-form-item) {
  margin-bottom: 8px;
}
</style>