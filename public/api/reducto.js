export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-doc-type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    const contentType = req.headers['content-type'] || '';

    // Step 1: Upload
    const uploadResp = await fetch('https://platform.reducto.ai/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REDUCTO_API_KEY}`,
        'Content-Type': contentType,
      },
      body,
    });

    const uploadText = await uploadResp.text();
    let uploadData;
    try { uploadData = JSON.parse(uploadText); } catch(e) { uploadData = { raw: uploadText }; }

    if (!uploadResp.ok) {
      return res.status(200).json({ 
        debug: true, 
        step: 'upload_failed',
        status: uploadResp.status,
        upload_response: uploadData
      });
    }

    // Return upload data so we can see exactly what fields come back
    return res.status(200).json({
      debug: true,
      step: 'upload_success',
      upload_status: uploadResp.status,
      upload_response: uploadData,
      file_id: uploadData.file_id,
      presigned_url: uploadData.presigned_url,
      all_keys: Object.keys(uploadData)
    });

  } catch (err) {
    res.status(200).json({ debug: true, step: 'exception', error: err.message });
  }
}
