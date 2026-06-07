// app/api/reducto/route.js
// Unified document processing: upload → detect doc type → extract → verify

import { EBCS_SCHEMA, EBCS_SYSTEM_PROMPT } from '../../../lib/ebcs/schema'
import { verifyEBCS } from '../../../lib/ebcs/verify'
import { DS_SCHEMA, DS_SYSTEM_PROMPT } from '../../../lib/ds/schema'
import { verifyDS } from '../../../lib/ds/verify'

export const maxDuration = 60

const DETECT_SCHEMA = {
  type: "object",
  properties: {
    contract_number: {
      type: "string",
      description: "The reference or contract number printed at the bottom right corner of the document. It typically starts with letters followed by digits (e.g. EBCS 00001, DS-12345, NEBCS 00002). Return null if not found."
    }
  }
}

const DETECT_PROMPT = `Extract only the contract or reference number from this document. It is usually printed at the bottom right corner of every page. Return only the contract_number field. Do not extract any other information.`

function detectDocType(contractNumber) {
  if (!contractNumber || typeof contractNumber !== 'string') return 'UNKNOWN'
  const n = contractNumber.trim().toUpperCase()
  if (/^NEBCS/.test(n)) return 'NEBCS'
  if (/^EBCS/.test(n)) return 'EBCS'
  if (/^DS/.test(n)) return 'DS'
  if (/^BCA/.test(n)) return 'BCA'
  if (/^AG/.test(n)) return 'AG'
  if (/^RC/.test(n)) return 'RC'
  if (/^PP/.test(n)) return 'PP'
  return 'UNKNOWN'
}

function getSchemaAndVerifier(docType) {
  switch (docType) {
    case 'EBCS':
      return { schema: EBCS_SCHEMA, prompt: EBCS_SYSTEM_PROMPT, verify: verifyEBCS }
    case 'DS':
      return { schema: DS_SCHEMA, prompt: DS_SYSTEM_PROMPT, verify: verifyDS }
    default:
      return null
  }
}

async function reductoExtract(fileRef, schema, systemPrompt, apiKey) {
  const resp = await fetch('https://platform.reducto.ai/extract', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: fileRef,
      instructions: { schema, system_prompt: systemPrompt },
      settings: { include_images: false }
    })
  })
  if (!resp.ok) {
    const t = await resp.text()
    throw new Error(`Extract failed: ${resp.status} — ${t}`)
  }
  const data = await resp.json()
  return data.result?.[0] ?? data.result ?? data
}

export async function POST(request) {
  try {
    const body = await request.arrayBuffer()
    const contentType = request.headers.get('content-type') || ''
    const apiKey = process.env.REDUCTO_API_KEY

    // Step 1: Upload once
    const uploadResp = await fetch('https://platform.reducto.ai/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': contentType
      },
      body: Buffer.from(body)
    })

    if (!uploadResp.ok) {
      const t = await uploadResp.text()
      return Response.json({ error: `Upload failed: ${uploadResp.status} — ${t}` })
    }

    const uploadData = await uploadResp.json()
    const fileRef = `reducto://${uploadData.file_id}`

    // Step 2: Detect document type via lightweight extraction
    let detectedDocType = 'UNKNOWN'
    let contractNumber = null
    try {
      const detectResult = await reductoExtract(fileRef, DETECT_SCHEMA, DETECT_PROMPT, apiKey)
      contractNumber = detectResult?.contract_number ?? null
      detectedDocType = detectDocType(contractNumber)
    } catch {
      // Detection failed — fall through to UNKNOWN handling
    }

    // Step 3: Route to correct schema + verifier
    const handler = getSchemaAndVerifier(detectedDocType)

    if (!handler) {
      return Response.json({
        error: `Unrecognised document type: "${contractNumber || 'unknown'}". Supported types: EBCS, DS.`,
        detected_contract_number: contractNumber,
        detected_doc_type: detectedDocType,
        file_id: uploadData.file_id
      })
    }

    // Step 4: Full extraction with the correct schema
    let rawExtraction
    try {
      rawExtraction = await reductoExtract(fileRef, handler.schema, handler.prompt, apiKey)
    } catch (err) {
      return Response.json({
        error: err.message,
        doc_type: detectedDocType,
        file_id: uploadData.file_id
      })
    }

    // Step 5: Verify
    const report = handler.verify(rawExtraction)

    return Response.json({
      extraction: rawExtraction,
      report,
      doc_type: detectedDocType,
      file_id: uploadData.file_id
    })

  } catch (err) {
    return Response.json({ error: err.message })
  }
}
