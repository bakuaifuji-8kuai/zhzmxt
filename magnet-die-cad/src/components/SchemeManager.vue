<template>
  <div class="scheme-manager">
    <div class="manager-toolbar">
      <el-input
        v-model="searchText"
        placeholder="搜索方案"
        clearable
        size="small"
        style="width: 180px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <div class="toolbar-actions">
        <el-button size="small" icon="Upload" @click="importSchemes">导入</el-button>
        <el-button size="small" icon="Download" @click="exportSchemes">导出全部</el-button>
      </div>
    </div>

    <div class="scheme-list">
      <div v-if="filteredSchemes.length === 0" class="empty-state">
        <el-icon :size="40" color="#ccc"><FolderOpen /></el-icon>
        <div>暂无方案</div>
        <div class="empty-hint">点击顶部"保存方案"按钮保存当前配置</div>
      </div>

      <div v-else class="scheme-items">
        <div
          v-for="scheme in filteredSchemes"
          :key="scheme.id"
          class="scheme-item"
          :class="{ active: selectedId === scheme.id }"
          @click="selectedId = scheme.id"
        >
          <div class="scheme-header">
            <div class="scheme-name">{{ scheme.name }}</div>
            <div class="scheme-mold">{{ getMoldTypeName(scheme.moldType) }}</div>
          </div>
          <div class="scheme-info">
            <span>w={{ scheme.form.w }} h={{ scheme.form.h }}</span>
            <span>{{ scheme.createdAt }}</span>
          </div>
          <div class="scheme-actions">
            <el-button size="small" icon="Edit" @click.stop="renameScheme(scheme)">重命名</el-button>
            <el-button size="small" type="primary" icon="Download" @click.stop="$emit('load', scheme)">加载</el-button>
            <el-button size="small" type="danger" icon="Delete" @click.stop="$emit('delete', scheme.id)">删除</el-button>
          </div>
        </div>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="hidden-input"
      @change="handleFileImport"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['load', 'delete'])

const searchText = ref('')
const selectedId = ref(null)
const fileInput = ref(null)

const schemes = ref([])

const moldTypeNames = {
  block: '方块磁',
  inner_arc: '内弧常规',
  inner_arc_converge: '内弧汇聚',
  outer_arc: '外弧'
}

function getMoldTypeName(type) {
  return moldTypeNames[type] || type
}

onMounted(() => {
  loadSchemesFromStorage()
})

function loadSchemesFromStorage() {
  const stored = localStorage.getItem('magnetSchemes')
  if (stored) {
    schemes.value = JSON.parse(stored)
  }
}

const filteredSchemes = computed(() => {
  if (!searchText.value) return schemes.value
  const keyword = searchText.value.toLowerCase()
  return schemes.value.filter(s =>
    s.name.toLowerCase().includes(keyword) ||
    getMoldTypeName(s.moldType).includes(keyword) ||
    s.form.w.toString().includes(keyword) ||
    s.form.h.toString().includes(keyword)
  )
})

function renameScheme(scheme) {
  ElPrompt.prompt({
    title: '重命名方案',
    inputValue: scheme.name,
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then((newName) => {
    scheme.name = newName
    localStorage.setItem('magnetSchemes', JSON.stringify(schemes.value))
    ElMessage.success('重命名成功')
  }).catch(() => {})
}

function importSchemes() {
  fileInput.value?.click()
}

function handleFileImport(event) {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result)
      if (Array.isArray(imported)) {
        schemes.value = [...schemes.value, ...imported]
        localStorage.setItem('magnetSchemes', JSON.stringify(schemes.value))
        ElMessage.success(`成功导入 ${imported.length} 个方案`)
      } else {
        ElMessage.error('导入文件格式不正确')
      }
    } catch {
      ElMessage.error('导入文件解析失败')
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

function exportSchemes() {
  if (schemes.value.length === 0) {
    ElMessage.warning('暂无方案可导出')
    return
  }

  const dataStr = JSON.stringify(schemes.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `瓦磁模具方案_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.scheme-manager {
  height: 400px;
  display: flex;
  flex-direction: column;
}

.manager-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 10px;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.scheme-list {
  flex: 1;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.empty-hint {
  font-size: 12px;
  margin-top: 4px;
}

.scheme-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scheme-item {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.scheme-item:hover {
  border-color: #90cdf4;
  background: #f0f7ff;
}

.scheme-item.active {
  border-color: #2c5282;
  background: #ebf8ff;
}

.scheme-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.scheme-name {
  font-weight: 600;
  color: #333;
}

.scheme-mold {
  font-size: 12px;
  color: #2c5282;
  padding: 2px 8px;
  background: #ebf8ff;
  border-radius: 10px;
}

.scheme-info {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #888;
  margin-bottom: 8px;
}

.scheme-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.hidden-input {
  display: none;
}
</style>