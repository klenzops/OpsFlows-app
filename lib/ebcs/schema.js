// lib/ebcs/schema.js
// What Reducto extracts from an EBCS document + the system prompt

export const EBCS_SYSTEM_PROMPT = `You are extracting structured data from a Quebec OACIQ mandatory form — Exclusive Brokerage Contract for Sale (EBCS).

Rules you must follow without exception:
- Extract data ONLY from fields that are visibly filled in. Never infer, assume, or guess blank fields.
- For signature fields, return true only if a visible handwritten signature or ink mark is present. A printed name is not a signature.
- For checkbox fields, return the text of whichever option is checked. If nothing is checked, return null.
- For the seller initials boxes on the cover page, you MUST return exactly 4 objects (one per box labeled SELLER 1, 2, 3, 4). Return null for any box that is blank.
- The brokerage contract number appears in the bottom right corner of every page in large bold text starting with EBCS.
- Extract each seller separately. Do not merge seller information across rows.
- Do not add commentary, explanations, or fields not in the schema.`

export const EBCS_SCHEMA = {
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
      description: "The expiry date of the brokerage contract found in clause 2.1. Return the date EXACTLY as it is written on the form — do not reformat, convert, or abbreviate it. Return null if blank."
    },
    "Property Address": {
      type: "string",
      description: "Full civic address of the property being sold, found in clause 3.1."
    },
    "Cadastral Number": {
      type: "string",
      description: "In clause 3.1 on page 3, look for the cadastral lot number. In Quebec, a renovated lot cadastral number is exactly 7 digits (e.g. 1234567). Return null if not found."
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
      description: "All sellers listed in Section 1. Return one entry per seller row. Only return rows where at least a Full Name is present.",
      items: {
        type: "object",
        properties: {
          "Full Name":                        { type: "string" },
          "Address":                          { type: "string" },
          "Phone Number":                     { type: "string" },
          "Email":                            { type: "string" },
          "ID type":                          { type: "string" },
          "ID Document Number":               { type: "string" },
          "ID expiry date":                   { type: "string" },
          "Date of Birth":                    { type: "string" },
          "Profession or Principal Activity": { type: "string" }
        }
      }
    },
    "Name of Agency or Broker": {
      type: "array",
      description: "The agency or broker listed in Section 1. Return one entry per broker column.",
      items: {
        type: "object",
        properties: {
          "Name":           { type: "string" },
          "Representative": { type: "string" },
          "Licence Number": { type: "string" },
          "Type":           { type: "string" },
          "Address":        { type: "string" },
          "Phone Number":   { type: "string" },
          "Email":          { type: "string" }
        }
      }
    },
    "Seller(s) initials": {
      type: "array",
      description: "Exactly 4 entries — one per box labeled SELLER 1, 2, 3, 4 on page 1.",
      items: {
        type: "object",
        required: ["Seller", "Initials"],
        properties: {
          "Seller":   { type: "number" },
          "Initials": { type: ["string", "null"] }
        }
      }
    },
    "Signature Part - Seller(s)": {
      type: "array",
      description: "Signature section in clause 15 for each seller.",
      items: {
        type: "object",
        properties: {
          "Signature present":       { type: "boolean" },
          "Signature date and time": { type: "string" },
          "Signature location":      { type: "string" }
        }
      }
    },
    "Signature Part - Agency/Broker": {
      type: "array",
      description: "Signature section in clause 15 for the broker or agency.",
      items: {
        type: "object",
        properties: {
          "Signature present":       { type: "boolean" },
          "Signature date and time": { type: "string" },
          "Signature location":      { type: "string" }
        }
      }
    },
    "Intervention of the married or civil union spouse of the seller": {
      type: "string",
      description: "Only extract if a spouse intervention section is visibly filled in clause 15."
    }
  }
}