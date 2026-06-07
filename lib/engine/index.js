// lib/engine/index.js
// Routes to the correct verify function based on document type

import { verifyEBCS } from '../ebcs/verify'
import { verifyDS } from '../ds/verify'

export function verify(docType, extraction) {
  switch (docType) {
    case 'EBCS':
    case 'NEBCS':  return verifyEBCS(extraction)
    case 'DS':     return verifyDS(extraction)
    default:       throw new Error(`Unknown document type: ${docType}`)
  }
}