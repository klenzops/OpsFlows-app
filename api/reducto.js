export const config = { 
  api: { bodyParser: false },
  maxDuration: 60
};

// ============================================================
// EBCS VERIFICATION RULES
// Source: OpsFlows verification table — exact 19 rules only.
// Nothing else. No AI discretion beyond what is listed here.
// ============================================================
const EBCS_RULES = [

  // 1. Brokerage contract number
  {
    field: "Brokerage contract number", clause: "-", severity: "critical",
    check: "present_and_format", format: /^EBCS\s?\d+/i,
    label: "Brokerage Contract Number",
    next_action: "Re-upload brokerage contract",
    email_text: "We're unable to retrieve the brokerage contract number. Please re-upload your document in PDF."
  },

  // 2. Declaration Seller (DS) number
  {
    field: "Declaration by the seller contract number", clause: "12.1", severity: "critical",
    check: "present",
    label: "Declaration Seller (DS) Number",
    next_action: "Draft an Amendment",
    email_text: "The Declaration of the seller (DS) at clause 12.1 is missing. Please draft an amendment for correction."
  },

  // 3. Contract End Date
  {
    field: "Contract End Date", clause: "2.1", severity: "critical",
    check: "present_and_date",
    label: "Contract End Date",
    next_action: "Draft an Amendment",
    email_text: "The date the contract ends at clause 2.1 is missing. Please draft an amendment for correction."
  },

  // 4. Seller Initials (custom check — cross-references seller count)
  {
    field: "Seller(s) initials", clause: "-", severity: "critical",
    check: "seller_initials",
    label: "Seller 1 Initials",
    next_action: "Contact Seller Immediately",
    email_text: "A seller(s) initials is missing. Please have the seller sign and resubmit."
  },

  // 5. Seller Full Name (at least Seller 1)
  {
    field: "Sellers[0].Full Name", clause: "1", severity: "critical",
    check: "present",
    label: "Seller 1 Full Name",
    next_action: "Draft an Amendment",
    email_text: "The Full Name of the seller(s) is missing. Please draft an amendment for correction."
  },

  // 6. Seller Signature (at least 1 = true)
  {
    field: "Signature Part - Seller(s)", clause: "15", severity: "critical",
    check: "at_least_one_signature",
    label: "Seller 1 Signature",
    next_action: "Contact Seller Immediately",
    email_text: "A seller(s) signature is missing. Please have the seller sign and resubmit."
  },

  // 7. Broker Signature (present = true)
  {
    field: "Signature Part - Agency/Broker[0].Signature present", clause: "15", severity: "critical",
    check: "is_true",
    label: "Broker 1 Signature",
    next_action: "Contact Broker Immediately",
    email_text: "A broker(s) signature is missing. Please have the broker sign and resubmit."
  },

  // 8. Property Address
  {
    field: "Property Address", clause: "3.1", severity: "critical",
    check: "present",
    label: "Property Address",
    next_action: "Draft an Amendment",
    email_text: "The property address at clause 3.1 is missing. Please draft an amendment for correction."
  },

  // 9. Cadastral Number
  {
    field: "Cadastral Number", clause: "3.1", severity: "critical",
    check: "present",
    label: "Cadastral Number",
    next_action: "Draft an Amendment",
    email_text: "The cadastral number at clause 3.1 is missing. Please draft an amendment for correction."
  },

  // 10. Asking Price
  {
    field: "Asking Price", clause: "4.1", severity: "critical",
    check: "present",
    label: "Asking Price",
    next_action: "Draft an Amendment",
    email_text: "The asking price at clause 4.1 is missing. Please draft an amendment for correction."
  },

  // 11. Seller ID type — just check it's present; the form only has valid checkboxes
  {
    field: "Sellers[0].ID type", clause: "1.1", severity: "critical",
    check: "present",
    label: "Seller 1 ID Type",
    next_action: "Draft an Amendment",
    email_text: "The Seller ID type at clause 1.1 is missing. Please draft an amendment for correction."
  },

  // 12. Seller ID Document Number
  {
    field: "Sellers[0].ID Document Number", clause: "1.1", severity: "critical",
    check: "present",
    label: "Seller 1 ID Document Number",
    next_action: "Draft an Amendment",
    email_text: "The Seller ID document number at clause 1.1 is missing/invalid. Please draft an amendment for correction."
  },

  // 13. Seller Date of Birth
  {
    field: "Sellers[0].Date of Birth", clause: "1.1", severity: "critical",
    check: "present",
    label: "Seller 1 Date of Birth",
    next_action: "Draft an Amendment",
    email_text: "The Seller Date of Birth at clause 1.1 is missing/invalid. Please draft an amendment for correction."
  },

  // 14. Remuneration (clause 7.1)
  {
    field: "Remuneration", clause: "7.1", severity: "critical",
    check: "present",
    label: "Remuneration",
    next_action: "Draft an Amendment",
    email_text: "The remuneration at clause 7.1 is missing/invalid. Please draft an amendment for correction."
  },

  // 15. Shared Remuneration (clause 7.3)
  {
    field: "Shared remuneration", clause: "7.3", severity: "critical",
    check: "present",
    label: "Shared Remuneration",
    next_action: "Draft an Amendment",
    email_text: "The shared remuneration at clause 7.3 is missing/invalid. Please draft an amendment for correction."
  },

  // 16. Broker Licence Number
  {
    field: "Name of Agency or Broker[0].Licence Number", clause: "1", severity: "critical",
    check: "present",
    label: "Broker 1 Licence Number",
    next_action: "Draft an Amendment",
    email_text: "The broker licence number at clause 1 is missing. Please draft an amendment for correction."
  },

  // 17. GST/QST status
  {
    field: "Goods and Services Tax and the Quebec Sales Tax", clause: "4.2", severity: "critical",
    check: "present",
    label: "GST/QST Status",
    next_action: "Draft an Amendment",
    email_text: "The GST/QST at clause 4.2 is missing. Please draft an amendment for correction."
  },

  // 18. Pre-emptive rights
  {
    field: "Pre-emptive rights", clause: "8.1", severity: "critical",
    check: "present",
    label: "Pre-emptive Rights",
    next_action: "Draft an Amendment",
    email_text: "The Pre-emptive rights at clause 8.1 is missing. Please draft an amendment for correction."
  }

];

// ============================================================
// CONDITIONAL RULES (only run if condition is met)
// ============================================================
const EBCS_CONDITIONAL_RULES = [

  // 19. Seller 2, 3, 4 — only if that seller exists (Full Name present)
  {
    condition_field: "Sellers[1].Full Name",
    label_prefix: "Seller 2",
    then_check: [
      { field: "Sellers[1].ID type", severity: "critical", label: "Seller 2 ID Type", check: "present", next_action: "Draft an Amendment", email_text: "The seller 2 ID type at clause 1 is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].ID Document Number", severity: "critical", label: "Seller 2 ID Document Number", check: "present", next_action: "Draft an Amendment", email_text: "The seller 2 ID document number is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].Date of Birth", severity: "critical", label: "Seller 2 Date of Birth", check: "present", next_action: "Draft an Amendment", email_text: "The seller 2 date of birth is missing. Please draft an amendment for correction." },
      { field: "Signature Part - Seller(s)[1].Signature present", severity: "critical", label: "Seller 2 Signature", check: "is_true", next_action: "Contact Seller Immediately", email_text: "Seller 2 signature is missing. Please have the seller sign and resubmit." }
    ]
  },
  {
    condition_field: "Sellers[2].Full Name",
    label_prefix: "Seller 3",
    then_check: [
      { field: "Sellers[2].ID type", severity: "critical", label: "Seller 3 ID Type", check: "present", next_action: "Draft an Amendment", email_text: "The seller 3 ID type at clause 1 is missing. Please draft an amendment for correction." },
      { field: "Sellers[2].ID Document Number", severity: "critical", label: "Seller 3 ID Document Number", check: "present", next_action: "Draft an Amendment", email_text: "The seller 3 ID document number is missing. Please draft an amendment for correction." },
      { field: "Sellers[2].Date of Birth", severity: "critical", label: "Seller 3 Date of Birth", check: "present", next_action: "Draft an Amendment", email_text: "The seller 3 date of birth is missing. Please draft an amendment for correction." },
      { field: "Signature Part - Seller(s)[2].Signature present", severity: "critical", label: "Seller 3 Signature", check: "is_true", next_action: "Contact Seller Immediately", email_text: "Seller 3 signature is missing. Please have the seller sign and resubmit." }
    ]
  },
  {
    condition_field: "Sellers[3].Full Name",
    label_prefix: "Seller 4",
    then_check: [
      { field: "Sellers[3].ID type", severity: "critical", label: "Seller 4 ID Type", check: "present", next_action: "Draft an Amendment", email_text: "The seller 4 ID type at clause 1 is missing. Please draft an amendment for correction." },
      { field: "Sellers[3].ID Document Number", severity: "critical", label: "Seller 4 ID Document Number", check: "present", next_action: "Draft an Amendment", email_text: "The seller 4 ID document number is missing. Please draft an amendment for correction." },
      { field: "Sellers[3].Date of Birth", severity: "critical", label: "Seller 4 Date of Birth", check: "present", next_action: "Draft an Amendment", email_text: "The seller 4 date of birth is missing. Please draft an amendment for correction." },
      { field: "Signature Part - Seller(s)[3].Signature present", severity: "critical", label: "Seller 4 Signature", check: "is_true", next_action: "Contact Seller Immediately", email_text: "Seller 4 signature is missing. Please have the seller sign and resubmit." }
    ]
  },

  // Spouse intervention — informational only, not critical
  {
    condition_field: "Intervention of the married or civil union spouse of the seller",
    label_prefix: "Spouse Intervention",
    severity_override: "info",
    then_check: [
      { field: "Intervention of the married or civil union spouse of the seller", severity: "info", label: "Spouse Intervention", check: "present", next_action: null, email_text: null }
    ]
  }

];

// ============================================================
// EXTRACTION SCHEMA
// ============================================================
const EBCS_SCHEMA = {
  type: "object",
  properties: {

    "Brokerage contract number": {
      type: "string",
      description: "The EBCS number printed in large bold text at the bottom right corner of every page. Format: EBCS followed by digits e.g. EBCS 00001."
    },
    "Declaration by the seller contract number": {
      type: "string",
      description: "Found in clause 12.1. Look for the sentence that reads: 'The provisions set forth in the Annex Declarations by the seller of the immovable DS -'. Immediately after 'DS -' there is a handwritten or printed number field. Extract only that number. It may appear as digits only (e.g. 12345) or with a DS prefix (e.g. DS 12345). Do not include the word 'specimen' or any watermark text. Return null if the field after 'DS -' is blank."
    },
    "Contract End Date": {
      type: "string",
      description: "The date the brokerage contract expires, found in clause 2.1. Return as written on the form."
    },
    "Property Address": {
      type: "string",
      description: "Full civic address of the property being sold, found in clause 3.1."
    },
    "Cadastral Number": {
      type: "string",
      description: "Cadastral lot number found in clause 3.1."
    },
    "Asking Price": {
      type: "string",
      description: "The asking sale price in clause 4.1. Include currency symbol if present."
    },
    "Remuneration": {
      type: "string",
      description: "The broker commission percentage or lump sum amount in clause 7.1."
    },
    "Shared remuneration": {
      type: "string",
      description: "The shared commission amount or percentage in clause 7.3."
    },
    "Goods and Services Tax and the Quebec Sales Tax": {
      type: "string",
      description: "The option checked in clause 4.2 — either 'Subject to' or 'Not subject to' GST/QST."
    },
    "Pre-emptive rights": {
      type: "string",
      description: "The option checked in clause 8.1 — either 'Subject to' or 'Not subject to' pre-emptive rights."
    },

    "Sellers": {
      type: "array",
      description: "All sellers listed in Section 1 — Identification of the seller. Return one entry per seller row. Only return rows where at least a Full Name is present. Do not return empty rows.",
      items: {
        type: "object",
        properties: {
          "Full Name":              { type: "string", description: "Seller's full legal name" },
          "Address":                { type: "string" },
          "Phone Number":           { type: "string" },
          "Email":                  { type: "string" },
          "ID type":                { type: "string", description: "Type of government-issued ID provided" },
          "ID Document Number":     { type: "string", description: "Document number on the ID" },
          "ID expiry date":         { type: "string" },
          "Date of Birth":          { type: "string", description: "Seller's date of birth in clause 1.1" },
          "Profession or Principal Activity": { type: "string" }
        }
      }
    },

    "Name of Agency or Broker": {
      type: "array",
      description: "The agency or broker listed in Section 1 — Identification of the Agency or the Broker. Return one entry per broker column.",
      items: {
        type: "object",
        properties: {
          "Name":           { type: "string", description: "Agency or brokerage name" },
          "Representative": { type: "string", description: "Broker's full name" },
          "Licence Number": { type: "string", description: "OACIQ licence number" },
          "Type":           { type: "string" },
          "Address":        { type: "string" },
          "Phone Number":   { type: "string" },
          "Email":          { type: "string" }
        }
      }
    },

    "Seller(s) initials": {
      type: "array",
      description: "At the very top of page 1, before Section 1, there is a horizontal row of 4 small rectangular boxes labeled underneath SELLER 1, SELLER 2, SELLER 3, SELLER 4. Look only at these 4 boxes. For each box: if you see handwritten characters inside the box return those characters as Initials. If the box is empty return null for Initials. Return one object per box using the label number (1, 2, 3, or 4) as the Seller value.",
      items: {
        type: "object",
        required: ["Seller", "Initials"],
        properties: {
          "Seller":   { type: "number", description: "1, 2, 3, or 4 matching the label under the box" },
          "Initials": { type: ["string", "null"], description: "Handwritten characters found inside the box or null if empty" }
        }
      }
    },

    "Signature Part - Seller(s)": {
      type: "array",
      description: "Signature section in clause 15 for each seller. Return one entry per seller signature line.",
      items: {
        type: "object",
        properties: {
          "Signature present":    { type: "boolean", description: "true only if a visible handwritten signature or ink mark is present. Printed text is not a signature." },
          "Signature date and time": { type: "string" },
          "Signature location":   { type: "string" }
        }
      }
    },

    "Signature Part - Agency/Broker": {
      type: "array",
      description: "Signature section in clause 15 for the broker or agency. Return one entry per broker signature line.",
      items: {
        type: "object",
        properties: {
          "Signature present":    { type: "boolean", description: "true only if a visible handwritten signature or ink mark is present. Printed text is not a signature." },
          "Signature date and time": { type: "string" },
          "Signature location":   { type: "string" }
        }
      }
    },

    "Intervention of the married or civil union spouse of the seller": {
      type: "string",
      description: "Only extract if a spouse intervention section is visibly filled in clause 15. Return the spouse's name or 'Present' if signed."
    }

  }
};

// ============================================================
// SYSTEM PROMPT — sent to Reducto on every extraction
// ============================================================
const EBCS_SYSTEM_PROMPT = `You are extracting structured data from a Quebec OACIQ mandatory form — Exclusive Brokerage Contract for Sale (EBCS).

Rules you must follow without exception:
- Extract data ONLY from fields that are visibly filled in. Never infer, assume, or guess blank fields.
- For signature fields, return true only if a visible handwritten signature or ink mark is present. A printed name is not a signature.
- For checkbox fields, return the text of whichever option is checked. If nothing is checked, return null.
- For the seller initials boxes on the cover page, you MUST return exactly 4 objects (one per box labeled SELLER 1, 2, 3, 4). Return null for any box that is blank.
- The brokerage contract number appears in the bottom right corner of every page in large bold text starting with EBCS.
- Extract each seller separately. Do not merge seller information across rows.
- Do not add commentary, explanations, or fields not in the schema.`;

// ============================================================
// FIELD ACCESSOR
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
// Deterministic — only checks the 19 rules above.
// No AI inference. No extra checks.
// ============================================================
function verifyEBCS(extraction) {
  const results = [];
  let criticalFails = 0;

  for (const rule of EBCS_RULES) {
    let passed = false;
    let detail = null;

    switch (rule.check) {

      case 'present': {
        const value = getField(extraction, rule.field);
        passed = value !== null && value !== undefined && value !== '' && value !== 'null';
        detail = passed ? String(value).slice(0, 120) : null;
        break;
      }

      case 'present_and_format': {
        const value = getField(extraction, rule.field);
        passed = value !== null && value !== undefined && value !== '' && value !== 'null';
        if (passed && rule.format) {
          passed = rule.format.test(String(value));
          detail = passed ? String(value) : `Found "${value}" — format invalid`;
        } else {
          detail = passed ? String(value) : null;
        }
        break;
      }

      case 'present_and_date': {
        const value = getField(extraction, rule.field);
        passed = value !== null && value !== undefined && value !== '' && value !== 'null';
        if (passed) {
          // Accept any string that looks like a date
          const looks_like_date = /\d/.test(String(value));
          passed = looks_like_date;
          detail = passed ? String(value) : `Found "${value}" — not a valid date`;
        }
        break;
      }

      case 'is_true': {
        const value = getField(extraction, rule.field);
        passed = value === true;
        detail = passed ? 'Signature present' : 'No signature found';
        break;
      }

      case 'at_least_one_signature': {
        const arr = getField(extraction, rule.field);
        if (Array.isArray(arr)) {
          passed = arr.some(s => s && s['Signature present'] === true);
          detail = passed ? 'At least 1 seller signature present' : 'No seller signatures found';
        } else {
          passed = false;
          detail = 'Signature section not found';
        }
        break;
      }

      case 'one_of': {
        const value = getField(extraction, rule.field);
        passed = value !== null && value !== undefined && value !== '' && value !== 'null';
        if (passed && rule.values) {
          passed = rule.values.some(v => String(value).toLowerCase().includes(v.toLowerCase()));
          detail = passed ? String(value) : `"${value}" is not a valid ID type`;
        } else {
          detail = passed ? String(value) : null;
        }
        break;
      }

      case 'seller_initials': {
        const initialsArr = getField(extraction, 'Seller(s) initials');
        if (!initialsArr || !Array.isArray(initialsArr) || initialsArr.length === 0) {
          passed = false;
          detail = 'Initials section not found';
          break;
        }
        // Count actual sellers from the Sellers array
        const sellers = getField(extraction, 'Sellers') || [];
        const sellerCount = Math.max(1, sellers.filter(s => s && s['Full Name']).length);
        // Build a lookup by Seller number (not array position)
        // Reducto may return them in any order or skip positions
        const initialsMap = {};
        initialsArr.forEach(function(entry) {
          if (entry && entry.Seller) {
            const num = parseInt(entry.Seller);
            const val = entry.Initials ?? entry.initials ?? null;
            initialsMap[num] = val;
          }
        });
        // Check only the positions that matter (1 through sellerCount)
        const missing = [];
        for (let i = 1; i <= sellerCount; i++) {
          const val = initialsMap[i];
          const hasInitials = val !== null && val !== undefined && String(val).trim() !== '' && String(val) !== 'null';
          if (!hasInitials) missing.push(i);
        }
        passed = missing.length === 0;
        detail = passed
          ? 'Seller ' + Array.from({length: sellerCount}, (_, i) => i+1).join(', ') + ' initialed'
          : 'Seller ' + missing.join(', ') + ' missing initials';
        break;
      }

    }

    if (!passed && rule.severity === 'critical') criticalFails++;

    results.push({
      rule: rule.label,
      clause: rule.clause,
      severity: rule.severity,
      passed,
      value: detail,
      field: rule.field,
      next_action: !passed ? rule.next_action : null,
      email_text: !passed ? rule.email_text : null
    });
  }

  // Conditional rules
  for (const condRule of EBCS_CONDITIONAL_RULES) {
    const condValue = getField(extraction, condRule.condition_field);
    const condMet = condValue !== null && condValue !== undefined && condValue !== '' && condValue !== 'null';
    if (!condMet) continue;

    for (const check of condRule.then_check) {
      const severity = condRule.severity_override || check.severity;
      let passed = false;
      let detail = null;

      if (check.check === 'is_true') {
        const v = getField(extraction, check.field);
        passed = v === true;
        detail = passed ? 'Signature present' : 'No signature found';
      } else {
        const v = getField(extraction, check.field);
        passed = v !== null && v !== undefined && v !== '' && v !== 'null';
        detail = passed ? String(v).slice(0, 120) : null;
      }

      if (!passed && severity === 'critical') criticalFails++;

      results.push({
        rule: check.label,
        clause: 'Conditional',
        severity,
        passed,
        value: detail,
        field: check.field,
        next_action: !passed && check.next_action ? check.next_action : null,
        email_text: !passed && check.email_text ? check.email_text : null
      });
    }
  }

  // Scoring
  const criticalResults = results.filter(r => r.severity === 'critical');
  const totalChecks = criticalResults.length;
  const passedCount = criticalResults.filter(r => r.passed).length;
  const score = totalChecks > 0 ? Math.round((passedCount / totalChecks) * 100) : 100;
  const verdict = criticalFails === 0 ? 'COMPLETE' : criticalFails <= 3 ? 'MISSING_FIELDS' : 'FLAGGED';

  const failedChecks = results.filter(r => !r.passed && r.severity === 'critical');
  const missing = failedChecks.map(r => `[${r.clause}] ${r.rule}`);

  // Key fields
  const seller1Name = getField(extraction, 'Sellers[0].Full Name') || 'Unknown Seller';
  const address     = getField(extraction, 'Property Address') || 'Unknown Address';
  const contractNum = getField(extraction, 'Brokerage contract number') || 'Unknown';
  const brokerEmail = getField(extraction, 'Name of Agency or Broker[0].Email') || null;
  const brokerName  = getField(extraction, 'Name of Agency or Broker[0].Representative') || null;

  // Summary
  const summary = criticalFails === 0
    ? `EBCS ${contractNum} for ${address} is fully compliant. All ${totalChecks} critical fields verified. Seller: ${seller1Name}.`
    : `EBCS ${contractNum} for ${address} has ${criticalFails} critical issue(s). ${passedCount} of ${totalChecks} checks passed. Seller: ${seller1Name}.`;

  // Broker email body
  const failedEmailLines = failedChecks
    .filter(r => r.email_text)
    .map((r, i) => `${i + 1}. ${r.email_text}`)
    .join('\n');

  const brokerEmailBody = criticalFails === 0
    ? `Hi ${brokerName || 'there'},\n\nThank you for uploading your documents. After verification, your EBCS file for ${address} (${contractNum}) has passed all compliance checks.\n\nHave a great day,\nOpsFlows Compliance`
    : `Hi ${brokerName || 'there'},\n\nThank you for uploading your documents. After verification of your EBCS file for ${address} (${contractNum}), the following items require your attention:\n\n${failedEmailLines}\n\nPlease address these items as soon as possible to ensure compliance with OACIQ regulations.\n\nHave a great day,\nOpsFlows Compliance`;

  return {
    verdict,
    score,
    checks_run: totalChecks,
    critical_fails: criticalFails,
    property_address: address,
    broker_name: brokerName,
    broker_email: brokerEmail,
    seller_name: seller1Name,
    contract_number: contractNum,
    cadastral_number: getField(extraction, 'Cadastral Number'),
    missing_items: missing,
    ok_items: results.filter(r => r.passed).map(r => `${r.rule}: ${r.value || '✓'}`),
    flagged_items: [],
    failed_checks: failedChecks,
    summary,
    broker_email_body: brokerEmailBody,
    check_results: results,
    verified_at: new Date().toISOString(),
    document_type: 'EBCS'
  };
}

// ============================================================
// VERCEL HANDLER
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

    // Upload to Reducto
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

    // Extract with schema
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
      return res.status(200).json({ error: `Extract failed: ${extractResp.status} — ${t}`, file_id: uploadData.file_id });
    }

    const extractData = await extractResp.json();
    const rawExtraction = extractData.result?.[0] ?? extractData.result ?? extractData;
    const report = verifyEBCS(rawExtraction);

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
