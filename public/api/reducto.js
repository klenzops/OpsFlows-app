export const config = { api: { bodyParser: false } };

const EBCS_SCHEMA = {
  type: "object",
  properties: {
    "Brokerage contract number": { type: "string" },
    "Property Address": { type: "string" },
    "Cadastral Number": { type: "number" },
    "Contract End Date": { type: "string" },
    "Asking Price": { type: "string" },
    "Sellers": {
      type: "array",
      items: {
        type: "object",
        properties: {
          "Position": { type: "string" },
          "Full Name": { type: "string" },
          "Address": { type: "string" },
          "Phone Number": { type: "string" },
          "Email": { type: "string" },
          "ID type": { type: "string" },
          "ID Document Number": { type: "string" },
          "Date of Birth": { type: "string" }
        }
      }
    },
    "Name of Agency or Broker": {
      type: "array",
      items: {
        type: "object",
        properties: {
          "Position": { type: "number" },
          "Name": { type: "string" },
          "Representative": { type: "string" },
          "Licence Number": { type: "string" },
          "Phone Number": { type: "string" },
          "Email": { type: "string" }
        }
      }
    },
    "Remuneration": { type: "string" },
    "Signature Part - Agency/Broker": {
      type: "array",
      items: {
        type: "object",
        properties: {
          "Signature present": { type: "boolean" },
          "Signature date and time": { type: "string" }
        }
      }
    },
    "Signature Part - Seller(s)": {
      type: "array",
      items: {
        type: "object",
        properties: {
          "Signature present": { type: "boolean" },
          "Signature date and time": { type: "string" }
        }
      }
    },
    "Seller(s) initials": {
      type: "array",
      items: {
        type: "object",
        properties: {
          "Seller": { type: "number" },
          "Initials": { type: "string" }
        }
      }
    }
  }
};

const EBCS_PROMPT = "This is a Quebec OACIQ mandatory form — Exclusive Brokerage Contract for Sale (EBCS). Extract data ONLY from filled-in fields. For signature fields, return true only if a visible signature is present. The brokerage contract number appears in the bottom right corner of every page. Extract each seller separately.";

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
    const docType = req.headers['x-doc-type'] || 'EBCS';
    const apiKey = process.env.REDUCTO_API_KEY;

    // Step 1: Upload
    const uploadResp = await fetch('https://platform.reducto.ai/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': contentType,
      },
      body,
    });

    if (!uploadResp.ok) {
      const errText = await uploadResp.text();
      return res.status(200).json({
        error: `Upload failed: ${uploadResp.status}`,
        detail: errText
      });
    }

    const uploadData = await uploadResp.json();
    
    // Build the reducto:// URL using file_id
    const reductoUrl = `reducto://${uploadData.file_id}`;

    // Step 2: Extract immediately after upload
    const extractResp = await fetch('https://platform.reducto.ai/extract', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: reductoUrl,
        instructions: {
          schema: EBCS_SCHEMA,
          system_prompt: EBCS_PROMPT
        },
        settings: {
          include_images: false,
          optimize_for_latency: true
        }
      }),
    });

    if (!extractResp.ok) {
      const errText = await extractResp.text();
      return res.status(200).json({
        error: `Extract failed: ${extractResp.status}`,
        detail: errText,
        upload_data: uploadData,
        reducto_url: reductoUrl
      });
    }

    const extractData = await extractResp.json();
    const result = extractData.result;
    const extraction = Array.isArray(result) ? result[0] : result;

    return res.status(200).json({
      extraction,
      doc_type: docType,
      usage: extractData.usage
    });

  } catch (err) {
    return res.status(200).json({ error: err.message, stack: err.stack });
  }
}
