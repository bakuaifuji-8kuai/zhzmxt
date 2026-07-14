<template>
  <div class="die-view-3d" ref="container">
    <div v-if="initError" class="error-overlay">
      <el-icon :size="40" color="#e53e3e"><Warning /></el-icon>
      <div class="error-title">3D渲染失败</div>
      <div class="error-detail">{{ errorDetail }}</div>
      <el-button type="primary" @click="reinit">重试</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  form: { type: Object, default: () => ({}) },
  moldType: { type: String, default: 'block' }
})

const container = ref(null)
const initError = ref(false)
const errorDetail = ref('')

let scene = null
let camera = null
let renderer = null
let controls = null
let animationId = null

function init(retryCount = 0) {
  if (!container.value) {
    errorDetail.value = '容器元素不存在'
    initError.value = true
    return
  }

  const cw = container.value.clientWidth
  const ch = container.value.clientHeight

  if (cw === 0 || ch === 0) {
    if (retryCount < 20) {
      errorDetail.value = `容器尺寸为 ${cw}x${ch}，等待可见... (${retryCount})`
      setTimeout(() => {
        if (!scene) init(retryCount + 1)
      }, 100)
      return
    } else {
      errorDetail.value = `容器尺寸为 ${cw}x${ch}，重试次数过多`
      initError.value = true
      return
    }
  }

  try {
    if (renderer) {
      renderer.dispose()
      container.value.innerHTML = ''
    }

    const THREE = window.THREE
    if (!THREE) {
      errorDetail.value = 'Three.js 未加载'
      initError.value = true
      return
    }

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xfafafa)

    camera = new THREE.PerspectiveCamera(60, cw / ch, 0.1, 1000)
    camera.position.set(0, 50, 80)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(cw, ch)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.value.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(50, 100, 50)
    scene.add(directionalLight)

    const axesHelper = new THREE.AxesHelper(50)
    scene.add(axesHelper)

    createMoldStructure(THREE)

    const OrbitControls = window.OrbitControls || THREE.OrbitControls
    if (OrbitControls) {
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.minDistance = 30
      controls.maxDistance = 200
    }

    animate()
    initError.value = false
    errorDetail.value = ''
  } catch (e) {
    errorDetail.value = e.message || '初始化失败'
    initError.value = true
  }
}

function createMoldStructure(THREE) {
  const s = 2

  const steelMaterial = new THREE.MeshLambertMaterial({ color: 0x8faadc })
  const nonMagMaterial = new THREE.MeshLambertMaterial({ color: 0xd4af37 })
  const stelliteMaterial = new THREE.MeshLambertMaterial({ color: 0xcd5c5c })
  const rawMaterial = new THREE.MeshLambertMaterial({ color: 0xa8c5e0 })

  if (props.moldType === 'block') {
    const upperW = props.form.w1 * s
    const upperH = props.form.h1 * s
    const upperD = 20

    const upperDie = new THREE.Mesh(
      new THREE.BoxGeometry(upperW, upperH, upperD),
      steelMaterial
    )
    upperDie.position.set(0, upperH / 2 + 30, 0)
    scene.add(upperDie)

    const coreW = (props.form.w1 - 6) * s
    const coreH = (props.form.h1 - 10) * s
    const core = new THREE.Mesh(
      new THREE.BoxGeometry(coreW, coreH, upperD - 2),
      nonMagMaterial
    )
    core.position.set(0, upperH / 2 + 30, 0)
    scene.add(core)

    const lowerW = props.form.w * s
    const lowerH = props.form.h2 * s
    const lower = new THREE.Mesh(
      new THREE.BoxGeometry(lowerW, lowerH, upperD),
      stelliteMaterial
    )
    lower.position.set(0, -lowerH / 2 + 10, 0)
    scene.add(lower)

    const rawW = props.form.w * s
    const rawH = props.form.h * s
    const raw = new THREE.Mesh(
      new THREE.BoxGeometry(rawW, rawH, upperD),
      rawMaterial
    )
    raw.position.set(0, -rawH / 2 - 10, 0)
    scene.add(raw)
  } else {
    const baseH = props.form.h1 * s
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(props.form.w * s + 10, baseH, 20),
      stelliteMaterial
    )
    base.position.set(0, -baseH / 2, 0)
    scene.add(base)

    const rawH = props.form.h * s
    const raw = new THREE.Mesh(
      new THREE.BoxGeometry(props.form.w * s, rawH, 20),
      rawMaterial
    )
    raw.position.set(0, rawH / 2 - baseH - 5, 0)
    scene.add(raw)

    const upperH = props.form.h1 * s + 5
    const upper = new THREE.Mesh(
      new THREE.BoxGeometry(props.form.w * s + 15, upperH, 20),
      steelMaterial
    )
    upper.position.set(0, upperH / 2 + rawH + 5, 0)
    scene.add(upper)
  }
}

function animate() {
  animationId = requestAnimationFrame(animate)
  if (controls) controls.update()
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

function handleResize() {
  if (!container.value || !camera || !renderer) return
  const cw = container.value.clientWidth
  const ch = container.value.clientHeight
  camera.aspect = cw / ch
  camera.updateProjectionMatrix()
  renderer.setSize(cw, ch)
}

function reinit() {
  initError.value = false
  errorDetail.value = ''
  init()
}

onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
})

watch(() => props.form, () => {
  init()
}, { deep: true })

watch(() => props.moldType, () => {
  init()
})

defineExpose({ reinit })
</script>

<style scoped>
.die-view-3d {
  width: 100%;
  height: 100%;
  position: relative;
}

.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  z-index: 10;
}

.error-title {
  font-size: 16px;
  font-weight: 600;
  color: #e53e3e;
  margin-top: 12px;
}

.error-detail {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  text-align: center;
  max-width: 300px;
}
</style>