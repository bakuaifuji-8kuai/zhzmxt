const REFERENCE_DATA = [
  { w: 40, h: 15, h1: 33, h2: 6, w1: 40, NI: 8000, upperCenter: 779, lowerCenter: 780 },
  { w: 60, h: 25, h1: 33, h2: 6, w1: 60, NI: 10000, upperCenter: 820, lowerCenter: 825 },
  { w: 30, h: 8, h1: 33, h2: 3, w1: 30, NI: 6000, upperCenter: 650, lowerCenter: 655 },
  { w: 50, h: 20, h1: 33, h2: 6, w1: 50, NI: 9000, upperCenter: 750, lowerCenter: 755 }
]

export function calculateMagneticField(params) {
  const { w, h, h1, h2, w1, NI } = params

  if (!w || !h || !h1 || !h2 || !w1 || !NI) {
    return { upperCenter: 0, lowerCenter: 0 }
  }

  let closestIdx = 0
  let minDist = Infinity

  for (let i = 0; i < REFERENCE_DATA.length; i++) {
    const ref = REFERENCE_DATA[i]
    const dist = Math.abs(ref.w - w) + Math.abs(ref.h - h) + Math.abs(ref.h1 - h1) +
                 Math.abs(ref.h2 - h2) + Math.abs(ref.w1 - w1) + Math.abs(ref.NI - NI) * 0.01
    if (dist < minDist) {
      minDist = dist
      closestIdx = i
    }
  }

  const ref = REFERENCE_DATA[closestIdx]

  const wRatio = w / ref.w
  const hRatio = h / ref.h
  const niRatio = NI / ref.NI
  const gapRatio = (h1 + h2) / (ref.h1 + ref.h2)

  const upperCenter = ref.upperCenter * niRatio * Math.sqrt(gapRatio) / Math.sqrt(wRatio * hRatio)
  const lowerCenter = ref.lowerCenter * niRatio * Math.sqrt(gapRatio) / Math.sqrt(wRatio * hRatio)

  return {
    upperCenter: Math.max(0, upperCenter),
    lowerCenter: Math.max(0, lowerCenter)
  }
}

export function verifyDesign(params, magneticResult) {
  const { h1, h2, NI } = params
  const messages = []
  let pass = true

  if (h2 !== undefined && h2 !== null) {
    if (h2 < 3) {
      messages.push('下冲模不导磁层厚度过薄')
      pass = false
    } else if (h2 > 12) {
      messages.push('下冲模不导磁层厚度偏厚')
    } else {
      messages.push(`h2=${h2}mm符合规范要求`)
    }
  }

  if (magneticResult.upperCenter > 0) {
    const avgField = (magneticResult.upperCenter + magneticResult.lowerCenter) / 2
    if (avgField < 400) {
      messages.push('平均磁场偏低，建议增加安匝数')
      pass = false
    } else if (avgField > 1200) {
      messages.push('平均磁场偏高，建议减少安匝数')
    } else {
      messages.push(`平均磁场${avgField.toFixed(1)}mT在合理范围内`)
    }
  }

  if (NI > 0) {
    if (NI < 3000) {
      messages.push('安匝数过低')
      pass = false
    } else if (NI > 15000) {
      messages.push('安匝数过高')
    } else {
      messages.push(`安匝${NI}在合理范围内`)
    }
  }

  if (h1 > 0) {
    if (h1 < 15) {
      messages.push('上模不导磁层偏薄')
    } else if (h1 > 60) {
      messages.push('上模不导磁层偏厚')
    } else {
      messages.push(`上模不导磁层h1=${h1}mm在合理范围内`)
    }
  }

  return {
    pass,
    message: messages.join('；')
  }
}