export function generateDXF(params) {
  const { w, h, h1, h2, w1 } = params

  const cx = 100
  const upperY = 150

  const upperW = w1
  const upperH = h1
  const upperX = cx - upperW / 2
  const upperYTop = upperY

  const coreW = w1 - 6
  const coreH = h1 - 10
  const coreX = upperX + 3
  const coreY = upperYTop + 5

  const gap = 8
  const lowerW = w
  const lowerH = h2
  const lowerX = cx - lowerW / 2
  const lowerY = upperYTop + upperH + gap

  const rawGap = 5
  const rawW = w
  const rawH = h
  const rawX = cx - rawW / 2
  const rawY = lowerY + lowerH + rawGap

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

  dxf += addRect(upperX, upperYTop, upperW, upperH, 'UPPER_DIE')
  dxf += addRect(coreX, coreY, coreW, coreH, 'NON_MAGNETIC')
  dxf += addRect(lowerX, lowerY, lowerW, lowerH, 'LOWER_PUNCH')
  dxf += addRect(rawX, rawY, rawW, rawH, 'RAW_BODY')

  const dimTopY = upperYTop - 15
  dxf += addDimHoriz(upperX, upperX + upperW, dimTopY, `w1=${w1.toFixed(1)}`, 'DIMENSION')

  const dimBotY = rawY + rawH + 15
  dxf += addDimHoriz(rawX, rawX + rawW, dimBotY, `w=${w.toFixed(1)}`, 'DIMENSION')

  const dim1X = upperX - 15
  dxf += addDimVert(dim1X, upperYTop, upperYTop + upperH, `h1=${h1.toFixed(1)}`, 'DIMENSION')

  const dim2X = lowerX - 25
  dxf += addDimVert(dim2X, lowerY, lowerY + lowerH, `h2=${h2.toFixed(1)}`, 'DIMENSION')

  const dim3X = rawX - 35
  dxf += addDimVert(dim3X, rawY, rawY + rawH, `h=${h.toFixed(1)}`, 'DIMENSION')

  const titleY = upperYTop - 30
  dxf += addText(cx - 40, titleY, 5, 'Fang Kuai Mo Ju Ci Lu Jie Mian', 'TEXT')

  dxf += addText(coreX + 2, coreY + coreH / 2 + 1.5, 3.5, '70Mn', 'TEXT')
  dxf += addText(lowerX + 2, lowerY + lowerH / 2 + 1.5, 3.5, 'Stellite', 'TEXT')
  dxf += addText(rawX + rawW / 2 - 5, rawY + rawH / 2 + 1.5, 3.5, 'Raw', 'TEXT')

  dxf += '0\nENDSEC\n0\nEOF\n'

  return dxf
}

function addRect(x, y, w, h, layer) {
  return `0\nLINE\n8\n${layer}\n10\n${x}\n20\n${y}\n11\n${x + w}\n21\n${y}\n` +
         `0\nLINE\n8\n${layer}\n10\n${x + w}\n20\n${y}\n11\n${x + w}\n21\n${y + h}\n` +
         `0\nLINE\n8\n${layer}\n10\n${x + w}\n20\n${y + h}\n11\n${x}\n21\n${y + h}\n` +
         `0\nLINE\n8\n${layer}\n10\n${x}\n20\n${y + h}\n11\n${x}\n21\n${y}\n`
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
