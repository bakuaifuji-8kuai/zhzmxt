export function generateDXF(params, moldType = 'block') {
  const { w, h, h1, h2, w1, R2, R3, R4, R1, h3, h4 } = params

  const cx = 100
  const upperY = 150

  let dxf = '0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC\n'
  dxf += '0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n7\n'
  dxf += '0\nLAYER\n2\n0\n70\n0\n62\n7\n6\nCONTINUOUS\n'
  dxf += '0\nLAYER\n2\nDIMENSION\n70\n0\n62\n7\n6\nCONTINUOUS\n'
  dxf += '0\nLAYER\n2\nUPPER_DIE\n70\n0\n62\n3\n6\nCONTINUOUS\n'
  dxf += '0\nLAYER\n2\nLOWER_PUNCH\n70\n0\n62\n1\n6\nCONTINUOUS\n'
  dxf += '0\nLAYER\n2\nRAW_BODY\n70\n0\n62\n5\n6\nCONTINUOUS\n'
  dxf += '0\nLAYER\n2\nNON_MAGNETIC\n70\n0\n62\n2\n6\nCONTINUOUS\n'
  dxf += '0\nLAYER\n2\nTEXT\n70\n0\n62\n7\n6\nCONTINUOUS\n'
  dxf += '0\nENDTAB\n0\nENDSEC\n'

  dxf += '0\nSECTION\n2\nENTITIES\n'

  if (moldType === 'block') {
    const upperW = w1
    const upperH = h1
    const upperX = cx - upperW / 2

    const coreW = w1 - 6
    const coreH = h1 - 10
    const coreX = upperX + 3
    const coreY = upperY + 5

    const gap = 8
    const lowerW = w
    const lowerX = cx - lowerW / 2
    const lowerY = upperY + upperH + gap

    const rawGap = 5
    const rawW = w
    const rawH = h
    const rawX = cx - rawW / 2
    const rawY = lowerY + lowerH + rawGap

    dxf += addRect(upperX, upperY, upperW, upperH, 'UPPER_DIE')
    dxf += addRect(coreX, coreY, coreW, coreH, 'NON_MAGNETIC')
    dxf += addRect(lowerX, lowerY, lowerW, lowerH, 'LOWER_PUNCH')
    dxf += addRect(rawX, rawY, rawW, rawH, 'RAW_BODY')

    dxf += addDimHoriz(upperX, upperY - 15, upperX + upperW, `w1=${w1.toFixed(1)}`, 'DIMENSION')
    dxf += addDimHoriz(rawX, rawY + rawH + 15, rawX + rawW, `w=${w.toFixed(1)}`, 'DIMENSION')
    dxf += addDimVert(upperX - 15, upperY, upperY + upperH, `h1=${h1.toFixed(1)}`, 'DIMENSION')
    dxf += addDimVert(lowerX - 25, lowerY, lowerY + lowerH, `h2=${h2.toFixed(1)}`, 'DIMENSION')
    dxf += addDimVert(rawX - 35, rawY, rawY + rawH, `h=${h.toFixed(1)}`, 'DIMENSION')

    dxf += addText(cx - 45, upperY - 35, 5, 'Fang Kuai Ci Mo Ju Ci Lu Jie Mian', 'TEXT')
    dxf += addText(coreX + 2, coreY + coreH / 2 + 1.5, 3.5, '70Mn', 'TEXT')
    dxf += addText(lowerX + 2, lowerY + lowerH / 2 + 1.5, 3.5, 'Stellite', 'TEXT')
    dxf += addText(rawX + rawW / 2 - 6, rawY + rawH / 2 + 1.5, 3.5, 'Raw', 'TEXT')
  } else if (moldType === 'inner_arc') {
    const upperOuterR = R2 + h1 + h + h2 + 15
    const upperInnerR = upperOuterR - h1
    const upperCenterY = cx - R2 - h / 2

    const startAngle = -0.3
    const endAngle = 0.3

    const upperStartX = cx + upperOuterR * Math.sin(startAngle)
    const upperStartY = upperCenterY + upperOuterR * Math.cos(startAngle)
    const upperEndX = cx + upperOuterR * Math.sin(endAngle)
    const upperEndY = upperCenterY + upperOuterR * Math.cos(endAngle)

    const upperInnerStartX = cx + upperInnerR * Math.sin(startAngle)
    const upperInnerStartY = upperCenterY + upperInnerR * Math.cos(startAngle)
    const upperInnerEndX = cx + upperInnerR * Math.sin(endAngle)
    const upperInnerEndY = upperCenterY + upperInnerR * Math.cos(endAngle)

    dxf += addArc(cx, upperCenterY, upperOuterR, startAngle, endAngle, 'UPPER_DIE')
    dxf += addArc(cx, upperCenterY, upperInnerR, startAngle, endAngle, 'UPPER_DIE')
    dxf += `0\nLINE\n8\nUPPER_DIE\n10\n${upperStartX}\n20\n${upperStartY}\n11\n${upperInnerStartX}\n21\n${upperInnerStartY}\n`
    dxf += `0\nLINE\n8\nUPPER_DIE\n10\n${upperEndX}\n20\n${upperEndY}\n11\n${upperInnerEndX}\n21\n${upperInnerEndY}\n`

    const rawOuterR = R2 + h
    const rawTop = upperCenterY + upperInnerR + 10
    const rawBottom = rawTop + h

    const rawStartX = cx + rawOuterR * Math.sin(startAngle)
    const rawStartY = rawTop + rawOuterR * Math.cos(startAngle) - upperInnerR - 10 + rawOuterR
    const rawEndX = cx + rawOuterR * Math.sin(endAngle)
    const rawEndY = rawTop + rawOuterR * Math.cos(endAngle) - upperInnerR - 10 + rawOuterR

    dxf += addArc(cx, rawTop + h / 2, rawOuterR, startAngle, endAngle, 'RAW_BODY')
    dxf += addArc(cx, rawTop + h / 2, R2, startAngle, endAngle, 'RAW_BODY')
    dxf += `0\nLINE\n8\nRAW_BODY\n10\n${rawStartX}\n20\n${rawBottom}\n11\n${cx + R2 * Math.sin(startAngle)}\n21\n${rawBottom}\n`
    dxf += `0\nLINE\n8\nRAW_BODY\n10\n${rawEndX}\n20\n${rawBottom}\n11\n${cx + R2 * Math.sin(endAngle)}\n21\n${rawBottom}\n`

    const lowerY = rawBottom + 8
    dxf += addRect(cx - w / 2, lowerY, w, h2, 'LOWER_PUNCH')

    dxf += addDimVert(cx - w / 2 - 30, lowerY, lowerY + h2, `h1=${h1.toFixed(1)}`, 'DIMENSION')
    dxf += addDimVert(cx - w / 2 - 50, rawTop, rawBottom, `h=${h.toFixed(1)}`, 'DIMENSION')

    dxf += addText(cx - 55, upperCenterY - upperOuterR - 20, 5, 'Nei Hu Ci Wa Mo Ju Ci Lu', 'TEXT')
    dxf += addText(cx - 6, rawTop + h / 2 + 1.5, 3.5, 'Raw', 'TEXT')
    dxf += addText(cx - w / 2 + 2, lowerY + h2 / 2 + 1.5, 3.5, 'Stellite', 'TEXT')
  } else if (moldType === 'inner_arc_converge') {
    const currentH3 = h3 || 12
    const currentH4 = h4 || 5
    const currentR2 = R2 || 50

    const upperTop = upperY
    const rawTop = upperTop + currentH3 + currentH4 + 10
    const rawBottom = rawTop + h
    const lowerY = rawBottom + 8

    const arcR = currentR2 + h / 2
    const arcCenterY = rawTop + h / 2

    const startAngle = -0.35
    const endAngle = 0.35

    const arcStartX = cx + arcR * Math.sin(startAngle)
    const arcStartY = arcCenterY + arcR * Math.cos(startAngle)
    const arcEndX = cx + arcR * Math.sin(endAngle)
    const arcEndY = arcCenterY + arcR * Math.cos(endAngle)

    dxf += `0\nLINE\n8\nUPPER_DIE\n10\n${arcStartX - 3}\n20\n${upperTop}\n11\n${arcStartX}\n21\n${arcStartY}\n`
    dxf += addArc(cx, arcCenterY, arcR, startAngle, endAngle, 'UPPER_DIE')
    dxf += `0\nLINE\n8\nUPPER_DIE\n10\n${arcEndX}\n20\n${arcEndY}\n11\n${arcEndX + 3}\n21\n${upperTop}\n`

    dxf += addRect(arcStartX - 8, upperTop, 5, currentH4, 'NON_MAGNETIC')
    dxf += addRect(arcEndX + 3, upperTop, 5, currentH4, 'NON_MAGNETIC')

    dxf += addArc(cx, arcCenterY, arcR, startAngle, endAngle, 'RAW_BODY')
    dxf += `0\nLINE\n8\nRAW_BODY\n10\n${arcStartX}\n20\n${arcStartY}\n11\n${arcStartX}\n21\n${rawBottom}\n`
    dxf += `0\nLINE\n8\nRAW_BODY\n10\n${arcEndX}\n20\n${arcEndY}\n11\n${arcEndX}\n21\n${rawBottom}\n`
    dxf += `0\nLINE\n8\nRAW_BODY\n10\n${arcStartX}\n20\n${rawBottom}\n11\n${arcEndX}\n21\n${rawBottom}\n`

    dxf += addRect(cx - w / 2, lowerY, w, h1, 'LOWER_PUNCH')

    dxf += addDimVert(cx - w / 2 - 30, lowerY, lowerY + h1, `h1=${h1.toFixed(1)}`, 'DIMENSION')
    dxf += addDimVert(cx - w / 2 - 50, rawTop, rawBottom, `h=${h.toFixed(1)}`, 'DIMENSION')

    dxf += addText(cx - 60, upperTop - 15, 5, 'Nei Hu Hui Ju Ci Wa Mo Ju', 'TEXT')
    dxf += addText(cx - 6, rawTop + h / 2 + 1.5, 3.5, 'Raw', 'TEXT')
    dxf += addText(cx - w / 2 + 2, lowerY + h1 / 2 + 1.5, 3.5, 'Stellite', 'TEXT')
  } else if (moldType === 'outer_arc') {
    const currentH3 = h3 || 12
    const currentH4 = h4 || 5
    const currentR2 = R2 || 50

    const upperTop = upperY
    const rawTop = upperTop + currentH3 + currentH4 + 10
    const rawBottom = rawTop + h
    const lowerY = rawBottom + 8

    const arcR = currentR2
    const arcCenterY = rawTop + h / 2

    const startAngle = -0.35
    const endAngle = 0.35

    const arcStartX = cx + arcR * Math.sin(startAngle)
    const arcStartY = arcCenterY + arcR * Math.cos(startAngle)
    const arcEndX = cx + arcR * Math.sin(endAngle)
    const arcEndY = arcCenterY + arcR * Math.cos(endAngle)

    dxf += `0\nLINE\n8\nUPPER_DIE\n10\n${arcStartX - 3}\n20\n${upperTop}\n11\n${arcStartX}\n21\n${arcStartY}\n`
    dxf += addArc(cx, arcCenterY, arcR, startAngle, endAngle, 'UPPER_DIE')
    dxf += `0\nLINE\n8\nUPPER_DIE\n10\n${arcEndX}\n20\n${arcEndY}\n11\n${arcEndX + 3}\n21\n${upperTop}\n`

    dxf += addRect(arcStartX - 8, upperTop, 5, currentH4, 'NON_MAGNETIC')
    dxf += addRect(arcEndX + 3, upperTop, 5, currentH4, 'NON_MAGNETIC')

    const rawOuterR = currentR2 + h
    const rawStartX = cx + rawOuterR * Math.sin(startAngle)
    const rawStartY = arcCenterY + rawOuterR * Math.cos(startAngle)
    const rawEndX = cx + rawOuterR * Math.sin(endAngle)
    const rawEndY = arcCenterY + rawOuterR * Math.cos(endAngle)

    dxf += addArc(cx, arcCenterY, arcR, startAngle, endAngle, 'RAW_BODY')
    dxf += addArc(cx, arcCenterY, rawOuterR, startAngle, endAngle, 'RAW_BODY')
    dxf += `0\nLINE\n8\nRAW_BODY\n10\n${arcStartX}\n20\n${arcStartY}\n11\n${rawStartX}\n21\n${rawStartY}\n`
    dxf += `0\nLINE\n8\nRAW_BODY\n10\n${arcEndX}\n20\n${arcEndY}\n11\n${rawEndX}\n21\n${rawEndY}\n`

    dxf += addRect(cx - w / 2, lowerY, w, h1, 'LOWER_PUNCH')

    dxf += addDimVert(cx - w / 2 - 30, lowerY, lowerY + h1, `h1=${h1.toFixed(1)}`, 'DIMENSION')
    dxf += addDimVert(cx - w / 2 - 50, rawTop, rawBottom, `h=${h.toFixed(1)}`, 'DIMENSION')

    dxf += addText(cx - 55, upperTop - 15, 5, 'Wai Hu Ci Wa Mo Ju Ci Lu', 'TEXT')
    dxf += addText(cx - 6, rawTop + h / 2 + 1.5, 3.5, 'Raw', 'TEXT')
    dxf += addText(cx - w / 2 + 2, lowerY + h1 / 2 + 1.5, 3.5, 'Stellite', 'TEXT')
  }

  dxf += '0\nENDSEC\n0\nEOF\n'

  return dxf
}

function addRect(x, y, w, h, layer) {
  return `0\nLINE\n8\n${layer}\n10\n${x}\n20\n${y}\n11\n${x + w}\n21\n${y}\n` +
         `0\nLINE\n8\n${layer}\n10\n${x + w}\n20\n${y}\n11\n${x + w}\n21\n${y + h}\n` +
         `0\nLINE\n8\n${layer}\n10\n${x + w}\n20\n${y + h}\n11\n${x}\n21\n${y + h}\n` +
         `0\nLINE\n8\n${layer}\n10\n${x}\n20\n${y + h}\n11\n${x}\n21\n${y}\n`
}

function addArc(cx, cy, r, startAngle, endAngle, layer) {
  const startDeg = startAngle * 180 / Math.PI
  const endDeg = endAngle * 180 / Math.PI
  return `0\nARC\n8\n${layer}\n10\n${cx}\n20\n${cy}\n30\n0\n40\n${r}\n50\n${startDeg}\n51\n${endDeg}\n`
}

function addDimHoriz(x1, y, x2, text, layer) {
  let out = ''
  out += `0\nLINE\n8\n${layer}\n10\n${x1}\n20\n${y}\n11\n${x2}\n21\n${y}\n`
  out += `0\nLINE\n8\n${layer}\n10\n${x1}\n20\n${y - 2}\n11\n${x1}\n21\n${y + 2}\n`
  out += `0\nLINE\n8\n${layer}\n10\n${x2}\n20\n${y - 2}\n11\n${x2}\n21\n${y + 2}\n`
  const midX = (x1 + x2) / 2
  out += addText(midX - text.length * 1.2, y - 6, 3, text, layer)
  return out
}

function addDimVert(x, y1, y2, text, layer) {
  let out = ''
  out += `0\nLINE\n8\n${layer}\n10\n${x}\n20\n${y1}\n11\n${x}\n21\n${y2}\n`
  out += `0\nLINE\n8\n${layer}\n10\n${x - 2}\n20\n${y1}\n11\n${x + 2}\n21\n${y1}\n`
  out += `0\nLINE\n8\n${layer}\n10\n${x - 2}\n20\n${y2}\n11\n${x + 2}\n21\n${y2}\n`
  const midY = (y1 + y2) / 2
  out += addText(x - text.length * 2.5 - 4, midY + 1, 3, text, layer)
  return out
}

function addText(x, y, height, text, layer) {
  return `0\nTEXT\n8\n${layer}\n10\n${x}\n20\n${y}\n40\n${height}\n1\n${text}\n`
}

export function downloadDXF(filename, content) {
  const blob = new Blob([content], { type: 'application/dxf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}