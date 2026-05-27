// lib/engine/index.js
// Routes to the correct verify function based on document type

import { verifyEBCS } from '../ebcs/verify.js'
import { verifyDS } from '../ds/verify.js'

export function verify(docType, extraction) {
  switch (docType) {
    case 'EBCS': return verifyEBCS(extraction)
    case 'DS':   return verifyDS(extraction)
    default:     throw new Error(`Unknown document type: ${docType}`)
  }
}