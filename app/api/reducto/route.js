// app/api/reducto/route.js
// Thin HTTP handler only — all logic lives in lib/ebcs/

import { EBCS_SCHEMA, EBCS_SYSTEM_PROMPT } from '../../../lib/ebcs/schema.js'
import { verifyEBCS } from '../../../lib/ebcs/verify.js'

export const maxDuration = 60

export async function POST(request) {
  try {
    const body = await request.arrayBuffer()
    const contentType = request.headers.get('content-type') || ''
    const apiKey = process.env.REDUCTO_API_KEY

    // Upload to Reducto
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

    // Extract with schema
    const extractResp = await fetch('https://platform.reducto.ai/extract', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: fileRef,
        instructions: { schema: EBCS_SCHEMA, system_prompt: EBCS_SYSTEM_PROMPT },
        settings: { include_images: false }
      })
    })

    if (!extractResp.ok) {
      const t = await extractResp.text()
      return Response.json({
        error: `Extract failed: ${extractResp.status} — ${t}`,
        file_id: uploadData.file_id
      })
    }

    const extractData = await extractResp.json()
    const rawExtraction = extractData.result?.[0] ?? extractData.result ?? extractData
    const report = verifyEBCS(rawExtraction)

    return Response.json({
      extraction: rawExtraction,
      report,
      doc_type: 'EBCS',
      file_id: uploadData.file_id
    })

  } catch (err) {
    return Response.json({ error: err.message })
  }
}