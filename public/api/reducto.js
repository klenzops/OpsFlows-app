export const config = { api: { bodyParser: false } };

const EBCS_SCHEMA = {
  type: "object",
  properties: {
    "Brokerage contract number": { type: "string", description: "The EBCS number at the bottom right of every page (e.g. EBCS 00001)" },
    "Seller(s) initials": { type: "array", items: { type: "object", properties: { "Seller": { type: "number", description: "The seller position number (1, 2, 3, or 4)" }, "Initials": { type: "string", description: "The exact characters written in the initial box for this seller. Return null if blank." } }, required: ["Seller", "Initials"] }, description: "On Page 1, above Section 1, there is a row of 4 initial boxes labeled SELLER 1, SELLER 2, SELLER 3, SELLER 4. Return an entry for all 4 positions regardless of whether they are filled." },
    "Name of Agency or Broker": { type: "array", items: { type: "object", properties: { "Position": { type: "number", description: "1 for left column, 2 for right column" }, "Name": { type: "string" }, "Representative": { type: "string" }, "Licence Number": { type: "string" }, "Type": { type: "string", description: "Return either 'real estate agency' or 'real estate broker acting on his own account' based on which checkbox is checked. Return null if neither." }, "Address": { type: "string" }, "Phone Number": { type: "string" }, "Email": { type: "string" } }, required: ["Position", "Name", "Representative", "Licence Number", "Type", "Address", "Phone Number", "Email"] }, description: "Section 1 - Identification of the Agency or Broker. Two side-by-side columns. Return object for both regardless of whether filled." },
    "Sellers": { type: "array", items: { type: "object", properties: { "Position": { type: "string" }, "Full Name": { type: "string" }, "Address": { type: "string" }, "Phone Number": { type: "string" }, "Email": { type: "string" }, "Representative name": { type: "string" }, "ID type": { type: "string", description: "Return exactly one of: Driver's Licence, Permanent Resident Card, Health Insurance Card, Passport, Other ID document (with photo). Return null if none checked." }, "ID Document Number": { type: "string" }, "ID expiry date": { type: "string" }, "ID issuing province, country": { type: "string" }, "Date of Birth": { type: "string" }, "Profession or Principal Activity": { type: "string" } }, required: ["Position", "Full Name", "Address", "Phone Number", "Email", "Representative name", "ID type", "ID Document Number", "ID expiry date", "ID issuing province, country", "Date of Birth", "Profession or Principal Activity"] }, description: "Section 1 - Identification of the Seller. Four seller blocks in 2x2 grid. Return all 4 positions. Return null for empty fields." },
    "Identity of seller verified on": { type: "string", format: "date", description: "Date seller identity was verified by broker. Section 1.1 Page 2." },
    "Contract End Date": { type: "string", format: "date", description: "Contract expiry date in clause 2.1 - Page 3" },
    "Property Address": { type: "string", description: "Full civic address in clause 3.1 including street number, street name, city, province, postal code - Page 3" },
    "Cadastral Number": { type: "number", description: "Cadastral lot number in Section 3.1 - Page 3" },
    "Asking Price": { type: "string", description: "Asking sale price in clause 4.1, numeric value only - Page 4" },
    "Goods and Services Tax and the Quebec Sales Tax": { type: "string", description: "Return 'Subject to' or 'Not Subject to' based on which checkbox is checked in clause 4.2 - Page 4" },
    "Date or Time Frame for the signing of deed of sale": { type: "string", description: "Date or timeframe for signing deed of sale in clause 5.1 - Page 5" },
    "Date or Time Frame for the signing of the occupancy": { type: "string", description: "Date or timeframe for occupancy in clause 5.2 - Page 5" },
    "Remuneration": { type: "string", description: "Commission percentage or lump sum in clause 7.1 - Page 5" },
    "Shared remuneration": { type: "string", description: "Commission percentage or lump sum in clause 7.3 - Page 5" },
    "Pre-emptive rights": { type: "string", description: "Return 'Subject to' or 'Not Subject to' based on checkbox in clause 8.1 - Page 6" },
    "Other Declaration - Clause 11.1": { type: "string", description: "Free-text declarations in clause 11.1 - Page 8. Return exact text or null if blank." },
    "Declaration by the seller contract number": { type: "string", description: "Contract number after 'Annex Declarations by the seller of the immovable DS-' in clause 12.1 - Page 9" },
    "General Annex AG contract number": { type: "string", description: "Contract number after 'General Annex AG-' in clause 12.1 - Page 9" },
    "Remuneration Annex RC contract number": { type: "string", description: "Contract number after 'Remuneration and Costs Annex RC-' in clause 12.1 - Page 9" },
    "(Any) Other contract number": { type: "string", description: "Any other contract number in clause 12.1 - Page 9" },
    "Signature Part - Agency/Broker": { type: "array", items: { type: "object", properties: { "Signature present": { type: "boolean", description: "true if visible signature or handwritten mark present, false if blank" }, "Signature date and time": { type: "string" }, "Signature location": { type: "string" } }, required: ["Signature present", "Signature date and time", "Signature location"] }, description: "Agency/broker signatures on left side of clause 15 - Page 10" },
    "Signature Part - Seller(s)": { type: "array", items: { type: "object", properties: { "Signature present": { type: "boolean" }, "Signature date and time": { type: "string" }, "Signature location": { type: "string" } }, required: ["Signature present", "Signature date and time", "Signature location"] }, description: "Up to 4 seller signatures on right side of clause 15 - Page 10" },
    "Intervention of the married or civil union spouse of the seller": { type: "string", description: "Spouse signature, date, time, location in clause 15 page 11" },
    "Any other information": { type: "string", description: "Any other filled information not captured by other fields" }
  },
  required: ["Brokerage contract number", "Sellers", "Property Address", "Contract End Date", "Asking Price", "Signature Part - Agency/Broker", "Signature Part - Seller(s)"]
};

const EBCS_SYSTEM_PROMPT = "This is a Quebec OACIQ mandatory form — Exclusive Brokerage Contract for Sale of a chiefly residential immovable containing less than 5 dwellings (EBCS). The document is structured with numbered clauses and labeled field lines. Extract data ONLY from filled-in fields; do not infer or assume values that are blank. For names, capture the full name exactly as written. For addresses, return the complete address as a single string. For dates, return them exactly as written on the form. For signature fields, return true only if a visible signature, initial, or handwritten mark is present on the signature line — return false if the line is blank. For the broker licence number, it appears in a box format directly under 'Represented by' in Section 1. For the brokerage contract number, it appears in the bottom right corner of every page in large bold text (e.g. EBCS 00001). If a field applies to multiple sellers, extract each separately. Do not merge seller information.";

// Schema map for different document types
const SCHEMAS = {
  'EBCS': { schema: EBCS_SCHEMA, system_prompt: EBCS_SYSTEM_PROMPT },
  'Brokerage Contract': { schema: EBCS_SCHEMA, system_prompt: EBCS_SYSTEM_PROMPT }, // same for now
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    const contentType = req.headers['content-type'] || '';
    const docType = req.headers['x-doc-type'] || 'EBCS';

    // Step 1: Upload file to Reducto
    const uploadResp = await fetch('https://platform.reducto.ai/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REDUCTO_API_KEY}`,
        'Content-Type': contentType,
      },
      body,
    });

    if (!uploadResp.ok) {
      const err = await uploadResp.text();
      return res.status(uploadResp.status).json({ error: 'Upload failed', detail: err });
    }

    const uploadData = await uploadResp.json();
    // Upload returns { file_id: "...", presigned_url: "..." }
    // Pass the presigned_url directly as input, or use the upload response object
    const fileRef = uploadData.presigned_url || `reducto://${uploadData.file_id}`;

    // Step 2: Extract with schema
    const schemaConfig = SCHEMAS[docType] || SCHEMAS['EBCS'];

    const extractBody = {
      input: fileRef,
      instructions: {
        schema: schemaConfig.schema,
        system_prompt: schemaConfig.system_prompt
      },
      settings: {
        include_images: false,
        optimize_for_latency: false
      }
    };

    const extractResp = await fetch('https://platform.reducto.ai/extract', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REDUCTO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(extractBody),
    });

    const extractData = await extractResp.json();
    res.status(extractResp.status).json({ 
      extraction: extractData,
      doc_type: docType,
      upload_ref: fileRef
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
