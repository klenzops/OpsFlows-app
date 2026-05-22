export const config = { 
  api: { bodyParser: false },
  maxDuration: 60
};

// ============================================================
// EBCS VERIFICATION RULES — based on Lena's rule sheet
// ============================================================
const EBCS_RULES = [
  { field: "Brokerage contract number", clause: "Cover", severity: "critical", check: "present_and_format", format: /^EBCS\s\d+/i, label: "Brokerage Contract Number" },
  { field: "Declaration by the seller contract number", clause: "12.1", severity: "critical", check: "present", label: "Declaration Seller (DS) Number" },
  { field: "Sellers[0].Full Name", clause: "1", severity: "critical", check: "present", label: "Seller 1 Full Name" },
  { field: "Signature Part - Seller(s)[0].Signature present", clause: "15", severity: "critical", check: "is_true", label: "Seller Signature" },
  { field: "Signature Part - Agency/Broker[0].Signature present", clause: "15", severity: "critical", check: "is_true", label: "Broker Signature" },
  { field: "Property Address", clause: "3.1", severity: "critical", check: "present", label: "Property Address" },
  { field: "Cadastral Number", clause: "3.1", severity: "critical", check: "present", label: "Cadastral Number" },
  { field: "Asking Price", clause: "4.1", severity: "critical", check: "present", label: "Asking Price" },
  { field: "Sellers[0].ID type", clause: "1.1", severity: "critical", check: "one_of", values: ["Driver's Licence","Permanent Resident Card","Health Insurance Card","Passport","Other ID document (with photo)"], label: "Seller ID Type" },
  { field: "Sellers[0].ID Document Number", clause: "1.1", severity: "critical", check: "present", label: "Seller ID Document Number" },
  { field: "Sellers[0].Date of Birth", clause: "1.1", severity: "critical", check: "present", label: "Seller Date of Birth" },
  { field: "Remuneration", clause: "7.1 & 7.3", severity: "critical", check: "present", label: "Remuneration" },
  { field: "Seller(s) initials[0].Initials", clause: "Cover", severity: "critical", check: "present", label: "Seller 1 Initials" },
  { field: "Name of Agency or Broker[0].Licence Number", clause: "1", severity: "critical", check: "present", label: "Broker Licence Number" },
  { field: "Goods and Services Tax and the Quebec Sales Tax", clause: "4.2", severity: "critical", check: "present", label: "GST/QST Status" },
  { field: "Pre-emptive rights", clause: "8.1", severity: "critical", check: "present", label: "Pre-emptive Rights" },
];

const EBCS_CONDITIONAL_RULES = [
  { 
    condition_field: "Sellers[1].Full Name", 
    condition: "present",
    then_check: [
      { field: "Sellers[1].ID type", severity: "critical", label: "Seller 2 ID Type" },
      { field: "Sellers[1].ID Document Number", severity: "critical", label: "Seller 2 ID Document Number" },
      { field: "Sellers[1].Date of Birth", severity: "critical", label: "Seller 2 Date of Birth" },
      { field: "Signature Part - Seller(s)[1].Signature present", severity: "critical", label: "Seller 2 Signature", check: "is_true" }
    ]
  }
];

const EBCS_SCHEMA = {
  type: "object",
  properties: {
    "Brokerage contract number": { type: "string", description: "EBCS number at bottom right of every page e.g. EBCS 00001" },
    "Property Address": { type: "string", description: "Full civic address in clause 3.1" },
    "Cadastral Number": { type: "number", description: "Cadastral lot number in clause 3.1" },
    "Contract End Date": { type: "string", description: "Contract expiry date in clause 2.1" },
    "Asking Price": { type: "string", description: "Asking sale price in clause 4.1" },
    "Remuneration": { type: "string", description: "Commission percentage or lump sum in clause 7.1" },
    "Shared remuneration": { type: "string", description: "Commission in clause 7.3" },
    "Goods and Services Tax and the Quebec Sales Tax": { type: "string", description: "Subject to or Not Subject to in clause 4.2" },
    "Pre-emptive rights": { type: "string", description: "Subject to or Not Subject to in clause 8.1" },
    "Declaration by the seller contract number": { type: "string", description: "DS number in clause 12.1" },
    "General Annex AG contract number": { type: "string", description: "AG number in clause 12.1" },
    "Remuneration Annex RC contract number": { type: "string", description: "RC number in clause 12.1" },
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
          "ID expiry date": { type: "string" },
          "Date of Birth": { type: "string" },
          "Profession or Principal Activity": { type: "string" }
        }
      },
      description: "All sellers from Section 1. Return all 4 positions, null for empty."
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
          "Type": { type: "string" },
          "Address": { type: "string" },
          "Phone Number": { type: "string" },
          "Email": { type: "string" }
        }
      },
      description: "Agency or broker from Section 1. Two columns."
    },
    "Seller(s) initials": {
      type: "array",
      items: {
        type: "object",
        properties: {
          "Seller": { type: "number" },
          "Initials": { type: "string" }
        }
      },
      description: "4 initial boxes on page 1 above Section 1"
    },
    "Signature Part - Agency/Broker": {
      type: "array",
      items: {
        type: "object",
        properties: {
          "Signature present": { type: "boolean" },
          "Signature date and time": { type: "string" },
          "Signature location": { type: "string" }
        }
      },
      description: "Broker signatures clause 15"
    },
    "Signature Part - Seller(s)": {
      type: "array",
      items: {
        type: "object",
        properties: {
          "Signature present": { type: "boolean" },
          "Signature date and time": { type: "string" },
          "Signature location": { type: "string" }
        }
      },
      description: "Seller signatures clause 15"
    },
    "Intervention of the married or civil union spouse of the seller": { type: "string" },
    "Other Declaration - Clause 11.1": { type: "string" },
    "Identity of seller verified on": { type: "string" }
  }
};

const EBCS_SYSTEM_PROMPT = "This is a Quebec OACIQ mandatory form — Exclusive Brokerage Contract for Sale (EBCS). Extract data ONLY from filled-in fields. Do not infer or assume blank fields. For signature fields, return true only if a visible signature or handwritten mark is present. The brokerage contract number appears in the bottom right corner of every page in large bold text. Extract each seller separately. Do not merge seller information.";

// ============================================================
// FIELD RESOLVER — gets nested values from extraction JSON
// ============================================================
function getField(obj, path) {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let current = obj;
  for (const part of parts) {
    if (current == null) return null;
    current = current[part];
  }
  return current ?? null;
}

// ============================================================
// VERIFICATION ENGINE
// ============================================================
function verifyEBCS(extraction) {
  const results = [];
  let criticalFails = 0;

  for (const rule of EBCS_RULES) {
    const value = getField(extraction, rule.field);
    let passed = false;
    let detail = null;

    switch(rule.check) {
      case 'present':
        passed = value !== null && value !== undefined && value !== '' && value !== 'null';
        detail = passed ? String(value).slice(0, 100) : null;
        break;
      case 'present_and_format':
        passed = value !== null && value !== undefined && value !== '';
        if (passed && rule.format) {
          passed = rule.format.test(String(value));
          detail = passed ? String(value) : `Found "${value}" but format invalid`;
        } else {
          detail = passed ? String(value) : null;
        }
        break;
      case 'is_true':
        passed = value === true;
        detail = passed ? 'Signature present' : 'No signature found';
        break;
      case 'one_of':
        passed = rule.values.includes(value);
        detail = passed ? String(value) : (value ? `"${value}" is not a valid type` : null);
        break;
    }

    if (!passed && rule.severity === 'critical') criticalFails++;

    results.push({
      rule: rule.label,
      clause: rule.clause,
      severity: rule.severity,
      passed,
      value: detail,
      field: rule.field
    });
  }

  // Conditional rules (Seller 2, 3, 4)
  for (const condRule of EBCS_CONDITIONAL_RULES) {
    const condValue = getField(extraction, condRule.condition_field);
    const condMet = condValue !== null && condValue !== undefined && condValue !== '' && condValue !== 'null';
    if (condMet) {
      for (const check of condRule.then_check) {
        const value = getField(extraction, check.field);
        let passed = check.check === 'is_true' ? value === true : (value !== null && value !== undefined && value !== '');
        if (!passed) criticalFails++;
        results.push({
          rule: check.label,
          clause: 'Conditional',
          severity: check.severity,
          passed,
          value: passed ? String(value).slice(0, 100) : null,
          field: check.field
        });
      }
    }
  }

  const totalChecks = results.length;
  const passed = results.filter(r => r.passed).length;
  const score = Math.round((passed / totalChecks) * 100);
  const verdict = criticalFails === 0 ? 'COMPLETE' : criticalFails <= 3 ? 'MISSING_FIELDS' : 'FLAGGED';

  const missing = results.filter(r => !r.passed && r.severity === 'critical').map(r => `[${r.clause}] ${r.rule}`);
  const ok = results.filter(r => r.passed).map(r => `${r.rule}: ${r.value || '✓'}`);

  // Build summary
  const seller1Name = getField(extraction, 'Sellers[0].Full Name') || 'Unknown Seller';
  const address = getField(extraction, 'Property Address') || 'Unknown Address';
  const contractNum = getField(extraction, 'Brokerage contract number') || 'Unknown';

  let summary = '';
  if (criticalFails === 0) {
    summary = `EBCS ${contractNum} for ${address} is fully compliant. All ${totalChecks} required fields verified. Seller: ${seller1Name}.`;
  } else {
    summary = `EBCS ${contractNum} for ${address} has ${criticalFails} critical issue(s) requiring attention. ${passed} of ${totalChecks} checks passed. Seller: ${seller1Name}.`;
  }

  return {
    verdict,
    score,
    checks_run: totalChecks,
    critical_fails: criticalFails,
    property_address: address,
    broker_name: getField(extraction, 'Name of Agency or Broker[0].Representative'),
    seller_name: seller1Name,
    contract_number: contractNum,
    cadastral_number: getField(extraction, 'Cadastral Number'),
    missing_items: missing,
    ok_items: ok,
    flagged_items: [],
    summary,
    check_results: results,  // Full audit trail
    verified_at: new Date().toISOString(),
    document_type: 'EBCS'
  };
}

// ============================================================
// MAIN HANDLER
// ============================================================
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
    const apiKey = process.env.REDUCTO_API_KEY;

    // Step 1: Upload to Reducto
    const uploadResp = await fetch('https://platform.reducto.ai/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': contentType },
      body,
    });

    if (!uploadResp.ok) {
      const t = await uploadResp.text();
      return res.status(200).json({ error: `Upload failed: ${uploadResp.status} — ${t}` });
    }

    const uploadData = await uploadResp.json();
    const fileRef = `reducto://${uploadData.file_id}`;

    // Step 2: Extract with EBCS schema
    const extractResp = await fetch('https://platform.reducto.ai/extract', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: fileRef,
        instructions: { schema: EBCS_SCHEMA, system_prompt: EBCS_SYSTEM_PROMPT },
        settings: { include_images: false }
      }),
    });

    if (!extractResp.ok) {
      const t = await extractResp.text();
      return res.status(200).json({ 
        error: `Extract failed: ${extractResp.status} — ${t}`,
        file_id: uploadData.file_id
      });
    }

    const extractData = await extractResp.json();
    const rawExtraction = extractData.result?.[0] ?? extractData.result ?? extractData;

    // Step 3: Run verification engine (no Claude needed — rules are deterministic)
    const report = verifyEBCS(rawExtraction);

    // Return everything
    return res.status(200).json({
      extraction: rawExtraction,
      report,
      doc_type: 'EBCS',
      file_id: uploadData.file_id
    });

  } catch (err) {
    return res.status(200).json({ error: err.message });
  }
}
