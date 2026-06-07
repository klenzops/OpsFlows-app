// lib/ebcs/rules.js
// Verification rules for EBCS (Exclusive Brokerage Contract for Sale)

export const EBCS_RULES = [
  // --- BROKERAGE CONTRACT IDENTIFICATION ---
  {
    field: "Brokerage contract number", clause: "-", severity: "critical",
    check: "present_and_format", format: /^EBCS\s?\d+/i,
    label: "Brokerage Contract Number",
    next_action: "Re-upload brokerage contract",
    email_text: "We're unable to retrieve the brokerage contract number. Please re-upload your document in PDF."
  },
  {
    field: "Declaration by the seller contract number", clause: "12.1", severity: "critical",
    check: "present",
    label: "Declaration Seller (DS) Number",
    next_action: "Draft an Amendment",
    email_text: "The Declaration of the seller (DS) at clause 12.1 is missing. Please draft an amendment for correction."
  },

  // --- CLAUSE 2: CONTRACT TERM ---
  {
    field: "Contract End Date", clause: "2.1", severity: "critical",
    check: "present_and_date_in_future",
    label: "Contract End Date",
    next_action: "Draft an Amendment",
    email_text: "The contract end date at clause 2.1 is missing or has already passed. Please draft an amendment for correction."
  },

  // --- SELLER INITIALS ---
  {
    field: "Seller(s) initials", clause: "-", severity: "critical",
    check: "seller_initials",
    label: "Seller Initials",
    next_action: "Contact Seller Immediately",
    email_text: "A seller's initials are missing. Please have the seller initial and resubmit."
  },

  // --- CLAUSE 1: SELLER IDENTIFICATION ---
  {
    field: "Sellers[0].Full Name", clause: "1", severity: "critical",
    check: "present",
    label: "Seller 1 Full Name",
    next_action: "Draft an Amendment",
    email_text: "The full name of seller 1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].Address", clause: "1", severity: "critical",
    check: "present",
    label: "Seller 1 Address",
    next_action: "Draft an Amendment",
    email_text: "The address of seller 1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].Email", clause: "1", severity: "critical",
    check: "present",
    label: "Seller 1 Email",
    next_action: "Draft an Amendment",
    email_text: "The email address of seller 1 is missing. Please draft an amendment for correction."
  },

  // --- CLAUSE 1.1: SELLER IDENTITY VERIFICATION ---
  {
    field: "Sellers[0].Identity Verified Date", clause: "1.1", severity: "critical",
    check: "present_and_date",
    label: "Seller 1 Identity Verified Date",
    next_action: "Draft an Amendment",
    email_text: "The identity verification date for seller 1 at clause 1.1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].ID type", clause: "1.1", severity: "critical",
    check: "present",
    label: "Seller 1 ID Type",
    next_action: "Draft an Amendment",
    email_text: "The ID document type for seller 1 at clause 1.1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].ID Document Number", clause: "1.1", severity: "critical",
    check: "present",
    label: "Seller 1 ID Document Number",
    next_action: "Draft an Amendment",
    email_text: "The ID document number for seller 1 at clause 1.1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].Province or Territory of ID", clause: "1.1", severity: "critical",
    check: "present",
    label: "Seller 1 Province/Territory of ID Issuance",
    next_action: "Draft an Amendment",
    email_text: "The province or territory of ID issuance for seller 1 at clause 1.1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].ID expiry date", clause: "1.1", severity: "critical",
    check: "present_and_date_not_expired",
    label: "Seller 1 ID Expiry Date",
    next_action: "Draft an Amendment",
    email_text: "The ID expiry date for seller 1 at clause 1.1 is missing or the document has already expired. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].Date of Birth", clause: "1.1", severity: "critical",
    check: "present_and_age_at_least_18",
    label: "Seller 1 Date of Birth",
    next_action: "Draft an Amendment",
    email_text: "The date of birth for seller 1 at clause 1.1 is missing or seller is under 18. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].Profession or Principal Activity", clause: "1.1", severity: "critical",
    check: "present",
    label: "Seller 1 Profession or Principal Activity",
    next_action: "Draft an Amendment",
    email_text: "The profession or principal activity for seller 1 at clause 1.1 is missing. Please draft an amendment for correction."
  },

  // --- CLAUSE 1: BROKER / AGENCY IDENTIFICATION ---
  {
    field: "Name of Agency or Broker[0].Name", clause: "1", severity: "critical",
    check: "present",
    label: "Broker 1 Agency Name",
    next_action: "Draft an Amendment",
    email_text: "The name of agency or broker 1 at clause 1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Name of Agency or Broker[0].Representative", clause: "1", severity: "critical",
    check: "present",
    label: "Broker 1 Represented By",
    next_action: "Draft an Amendment",
    email_text: "The 'Represented by' field for broker 1 at clause 1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Name of Agency or Broker[0].Address", clause: "1", severity: "critical",
    check: "present",
    label: "Broker 1 Agency Address",
    next_action: "Draft an Amendment",
    email_text: "The address of agency or broker 1 at clause 1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Name of Agency or Broker[0].Email", clause: "1", severity: "critical",
    check: "present",
    label: "Broker 1 Email",
    next_action: "Draft an Amendment",
    email_text: "The email address of agency or broker 1 at clause 1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Name of Agency or Broker[0].Licence Number", clause: "1", severity: "critical",
    check: "present",
    label: "Broker 1 Licence Number",
    next_action: "Draft an Amendment",
    email_text: "The broker licence number at clause 1 is missing. Please draft an amendment for correction."
  },

  // --- CLAUSE 3: PROPERTY ---
  {
    field: "Property Address", clause: "3.1", severity: "critical",
    check: "present",
    label: "Property Address",
    next_action: "Draft an Amendment",
    email_text: "The property address at clause 3.1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Cadastral Number", clause: "3.1", severity: "critical",
    check: "present",
    label: "Cadastral Number",
    next_action: "Draft an Amendment",
    email_text: "The cadastral number at clause 3.1 is missing. Please draft an amendment for correction."
  },

  // --- CLAUSE 4: PRICE & TAXES ---
  {
    field: "Asking Price", clause: "4.1", severity: "critical",
    check: "present",
    label: "Asking Price",
    next_action: "Draft an Amendment",
    email_text: "The asking price at clause 4.1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Goods and Services Tax and the Quebec Sales Tax", clause: "4.2", severity: "critical",
    check: "present",
    label: "GST/QST Status",
    next_action: "Draft an Amendment",
    email_text: "The GST/QST selection at clause 4.2 is missing. Please draft an amendment for correction."
  },

  // --- CLAUSE 5: DEED OF SALE & OCCUPANCY ---
  {
    field: "Date or Time Frame for the signing of deed of sale", clause: "5.1", severity: "critical",
    check: "present_and_date",
    label: "Date for Signing of Deed of Sale",
    next_action: "Draft an Amendment",
    email_text: "The date or time frame for signing the deed of sale at clause 5.1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Date or Time Frame for the signing of the occupancy", clause: "5.2", severity: "critical",
    check: "present_and_date",
    label: "Date for Occupancy",
    next_action: "Draft an Amendment",
    email_text: "The date or time frame for occupancy at clause 5.2 is missing. Please draft an amendment for correction."
  },

  // --- CLAUSE 7: REMUNERATION ---
  {
    field: "Remuneration", clause: "7.1", severity: "critical",
    check: "present",
    label: "Remuneration",
    next_action: "Draft an Amendment",
    email_text: "The remuneration at clause 7.1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Shared remuneration", clause: "7.3", severity: "critical",
    check: "present",
    label: "Shared Remuneration",
    next_action: "Draft an Amendment",
    email_text: "The shared remuneration at clause 7.3 is missing. Please draft an amendment for correction."
  },

  // --- CLAUSE 8: PRE-EMPTIVE RIGHTS ---
  {
    field: "Pre-emptive rights", clause: "8.1", severity: "critical",
    check: "present",
    label: "Pre-emptive Rights",
    next_action: "Draft an Amendment",
    email_text: "The pre-emptive rights selection at clause 8.1 is missing. Please draft an amendment for correction."
  },

  // --- CLAUSE 11.1: OTHER DECLARATIONS (admin flag, non-critical) ---
  {
    field: "Other declarations clause 11.1", clause: "11.1", severity: "info",
    check: "warning_if_present",
    label: "Other Declarations (Clause 11.1)",
    next_action: null,
    email_text: null
  },

  // --- CLAUSE 15: SIGNATURES ---
  {
    field: "Signature Part - Seller(s)", clause: "15", severity: "critical",
    check: "at_least_one_signature",
    label: "Seller 1 Signature",
    next_action: "Contact Seller Immediately",
    email_text: "A seller's signature is missing. Please have the seller sign and resubmit."
  },
  {
    field: "Signature Part - Seller(s)[0].Signature date and time", clause: "15", severity: "critical",
    check: "present",
    label: "Seller 1 Signing Date",
    next_action: "Contact Seller Immediately",
    email_text: "The signing date for seller 1 at clause 15 is missing. Please have the seller add the date and resubmit."
  },
  {
    field: "Signature Part - Seller(s)[0].Signature location", clause: "15", severity: "critical",
    check: "present",
    label: "Seller 1 Signing Location",
    next_action: "Contact Seller Immediately",
    email_text: "The signing location for seller 1 at clause 15 is missing. Please have the seller add the location and resubmit."
  },
  {
    field: "Signature Part - Agency/Broker[0].Signature present", clause: "15", severity: "critical",
    check: "is_true",
    label: "Broker 1 Signature",
    next_action: "Contact Broker Immediately",
    email_text: "A broker's signature is missing. Please have the broker sign and resubmit."
  },
  {
    field: "Signature Part - Agency/Broker[0].Signature date and time", clause: "15", severity: "critical",
    check: "present",
    label: "Broker 1 Signing Date",
    next_action: "Contact Broker Immediately",
    email_text: "The signing date for broker 1 at clause 15 is missing. Please have the broker add the date and resubmit."
  },
  {
    field: "Signature Part - Agency/Broker[0].Signature location", clause: "15", severity: "critical",
    check: "present",
    label: "Broker 1 Signing Location",
    next_action: "Contact Broker Immediately",
    email_text: "The signing location for broker 1 at clause 15 is missing. Please have the broker add the location and resubmit."
  }
]

export const EBCS_CONDITIONAL_RULES = [
  // --- SELLER 2 ---
  {
    condition_field: "Sellers[1].Full Name",
    label_prefix: "Seller 2",
    seller_position: 2,
    then_check: [
      { field: "Sellers[1].Full Name", clause: "1", severity: "critical", label: "Seller 2 Full Name", check: "present", next_action: "Draft an Amendment", email_text: "Seller 2 full name is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].Address", clause: "1", severity: "critical", label: "Seller 2 Address", check: "present", next_action: "Draft an Amendment", email_text: "Seller 2 address is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].Email", clause: "1", severity: "critical", label: "Seller 2 Email", check: "present", next_action: "Draft an Amendment", email_text: "Seller 2 email address is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].Identity Verified Date", clause: "1.1", severity: "critical", label: "Seller 2 Identity Verified Date", check: "present_and_date", next_action: "Draft an Amendment", email_text: "The identity verification date for seller 2 at clause 1.1 is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].ID type", clause: "1.1", severity: "critical", label: "Seller 2 ID Type", check: "present", next_action: "Draft an Amendment", email_text: "The ID type for seller 2 is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].ID Document Number", clause: "1.1", severity: "critical", label: "Seller 2 ID Document Number", check: "present", next_action: "Draft an Amendment", email_text: "The ID document number for seller 2 is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].Province or Territory of ID", clause: "1.1", severity: "critical", label: "Seller 2 Province/Territory of ID", check: "present", next_action: "Draft an Amendment", email_text: "The province or territory of ID issuance for seller 2 is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].ID expiry date", clause: "1.1", severity: "critical", label: "Seller 2 ID Expiry Date", check: "present_and_date_not_expired", next_action: "Draft an Amendment", email_text: "Seller 2 ID expiry date is missing or expired. Please draft an amendment for correction." },
      { field: "Sellers[1].Date of Birth", clause: "1.1", severity: "critical", label: "Seller 2 Date of Birth", check: "present_and_age_at_least_18", next_action: "Draft an Amendment", email_text: "Seller 2 date of birth is missing or seller is under 18. Please draft an amendment for correction." },
      { field: "Sellers[1].Profession or Principal Activity", clause: "1.1", severity: "critical", label: "Seller 2 Profession or Principal Activity", check: "present", next_action: "Draft an Amendment", email_text: "Seller 2 profession or principal activity is missing. Please draft an amendment for correction." },
      { field: "Signature Part - Seller(s)", clause: "15", severity: "critical", label: "Seller 2 Signature", check: "seller_sig_by_position", seller_position: 2, next_action: "Contact Seller Immediately", email_text: "Seller 2 signature is missing. Please have the seller sign and resubmit." },
      { field: "Signature Part - Seller(s)[1].Signature date and time", clause: "15", severity: "critical", label: "Seller 2 Signing Date", check: "present", next_action: "Contact Seller Immediately", email_text: "The signing date for seller 2 at clause 15 is missing." },
      { field: "Signature Part - Seller(s)[1].Signature location", clause: "15", severity: "critical", label: "Seller 2 Signing Location", check: "present", next_action: "Contact Seller Immediately", email_text: "The signing location for seller 2 at clause 15 is missing." }
    ]
  },

  // --- SELLER 3 ---
  {
    condition_field: "Sellers[2].Full Name",
    label_prefix: "Seller 3",
    seller_position: 3,
    then_check: [
      { field: "Sellers[2].Full Name", clause: "1", severity: "critical", label: "Seller 3 Full Name", check: "present", next_action: "Draft an Amendment", email_text: "Seller 3 full name is missing. Please draft an amendment for correction." },
      { field: "Sellers[2].Address", clause: "1", severity: "critical", label: "Seller 3 Address", check: "present", next_action: "Draft an Amendment", email_text: "Seller 3 address is missing. Please draft an amendment for correction." },
      { field: "Sellers[2].Email", clause: "1", severity: "critical", label: "Seller 3 Email", check: "present", next_action: "Draft an Amendment", email_text: "Seller 3 email address is missing. Please draft an amendment for correction." },
      { field: "Sellers[2].Identity Verified Date", clause: "1.1", severity: "critical", label: "Seller 3 Identity Verified Date", check: "present_and_date", next_action: "Draft an Amendment", email_text: "The identity verification date for seller 3 is missing." },
      { field: "Sellers[2].ID type", clause: "1.1", severity: "critical", label: "Seller 3 ID Type", check: "present", next_action: "Draft an Amendment", email_text: "The ID type for seller 3 is missing." },
      { field: "Sellers[2].ID Document Number", clause: "1.1", severity: "critical", label: "Seller 3 ID Document Number", check: "present", next_action: "Draft an Amendment", email_text: "The ID document number for seller 3 is missing." },
      { field: "Sellers[2].Province or Territory of ID", clause: "1.1", severity: "critical", label: "Seller 3 Province/Territory of ID", check: "present", next_action: "Draft an Amendment", email_text: "The province or territory of ID issuance for seller 3 is missing." },
      { field: "Sellers[2].ID expiry date", clause: "1.1", severity: "critical", label: "Seller 3 ID Expiry Date", check: "present_and_date_not_expired", next_action: "Draft an Amendment", email_text: "Seller 3 ID expiry date is missing or expired." },
      { field: "Sellers[2].Date of Birth", clause: "1.1", severity: "critical", label: "Seller 3 Date of Birth", check: "present_and_age_at_least_18", next_action: "Draft an Amendment", email_text: "Seller 3 date of birth is missing or seller is under 18." },
      { field: "Sellers[2].Profession or Principal Activity", clause: "1.1", severity: "critical", label: "Seller 3 Profession or Principal Activity", check: "present", next_action: "Draft an Amendment", email_text: "Seller 3 profession or principal activity is missing." },
      { field: "Signature Part - Seller(s)", clause: "15", severity: "critical", label: "Seller 3 Signature", check: "seller_sig_by_position", seller_position: 3, next_action: "Contact Seller Immediately", email_text: "Seller 3 signature is missing." },
      { field: "Signature Part - Seller(s)[2].Signature date and time", clause: "15", severity: "critical", label: "Seller 3 Signing Date", check: "present", next_action: "Contact Seller Immediately", email_text: "The signing date for seller 3 at clause 15 is missing." },
      { field: "Signature Part - Seller(s)[2].Signature location", clause: "15", severity: "critical", label: "Seller 3 Signing Location", check: "present", next_action: "Contact Seller Immediately", email_text: "The signing location for seller 3 at clause 15 is missing." }
    ]
  },

  // --- SELLER 4 ---
  {
    condition_field: "Sellers[3].Full Name",
    label_prefix: "Seller 4",
    seller_position: 4,
    then_check: [
      { field: "Sellers[3].Full Name", clause: "1", severity: "critical", label: "Seller 4 Full Name", check: "present", next_action: "Draft an Amendment", email_text: "Seller 4 full name is missing." },
      { field: "Sellers[3].Address", clause: "1", severity: "critical", label: "Seller 4 Address", check: "present", next_action: "Draft an Amendment", email_text: "Seller 4 address is missing." },
      { field: "Sellers[3].Email", clause: "1", severity: "critical", label: "Seller 4 Email", check: "present", next_action: "Draft an Amendment", email_text: "Seller 4 email address is missing." },
      { field: "Sellers[3].Identity Verified Date", clause: "1.1", severity: "critical", label: "Seller 4 Identity Verified Date", check: "present_and_date", next_action: "Draft an Amendment", email_text: "The identity verification date for seller 4 is missing." },
      { field: "Sellers[3].ID type", clause: "1.1", severity: "critical", label: "Seller 4 ID Type", check: "present", next_action: "Draft an Amendment", email_text: "The ID type for seller 4 is missing." },
      { field: "Sellers[3].ID Document Number", clause: "1.1", severity: "critical", label: "Seller 4 ID Document Number", check: "present", next_action: "Draft an Amendment", email_text: "The ID document number for seller 4 is missing." },
      { field: "Sellers[3].Province or Territory of ID", clause: "1.1", severity: "critical", label: "Seller 4 Province/Territory of ID", check: "present", next_action: "Draft an Amendment", email_text: "The province or territory of ID issuance for seller 4 is missing." },
      { field: "Sellers[3].ID expiry date", clause: "1.1", severity: "critical", label: "Seller 4 ID Expiry Date", check: "present_and_date_not_expired", next_action: "Draft an Amendment", email_text: "Seller 4 ID expiry date is missing or expired." },
      { field: "Sellers[3].Date of Birth", clause: "1.1", severity: "critical", label: "Seller 4 Date of Birth", check: "present_and_age_at_least_18", next_action: "Draft an Amendment", email_text: "Seller 4 date of birth is missing or seller is under 18." },
      { field: "Sellers[3].Profession or Principal Activity", clause: "1.1", severity: "critical", label: "Seller 4 Profession or Principal Activity", check: "present", next_action: "Draft an Amendment", email_text: "Seller 4 profession or principal activity is missing." },
      { field: "Signature Part - Seller(s)", clause: "15", severity: "critical", label: "Seller 4 Signature", check: "seller_sig_by_position", seller_position: 4, next_action: "Contact Seller Immediately", email_text: "Seller 4 signature is missing." },
      { field: "Signature Part - Seller(s)[3].Signature date and time", clause: "15", severity: "critical", label: "Seller 4 Signing Date", check: "present", next_action: "Contact Seller Immediately", email_text: "The signing date for seller 4 at clause 15 is missing." },
      { field: "Signature Part - Seller(s)[3].Signature location", clause: "15", severity: "critical", label: "Seller 4 Signing Location", check: "present", next_action: "Contact Seller Immediately", email_text: "The signing location for seller 4 at clause 15 is missing." }
    ]
  },

  // --- BROKER 2 ---
  {
    condition_field: "Name of Agency or Broker[1].Representative",
    label_prefix: "Broker 2",
    then_check: [
      { field: "Name of Agency or Broker[1].Name", clause: "1", severity: "critical", label: "Broker 2 Agency Name", check: "present", next_action: "Draft an Amendment", email_text: "The name of agency or broker 2 is missing." },
      { field: "Name of Agency or Broker[1].Representative", clause: "1", severity: "critical", label: "Broker 2 Represented By", check: "present", next_action: "Draft an Amendment", email_text: "The 'Represented by' field for broker 2 is missing." },
      { field: "Name of Agency or Broker[1].Address", clause: "1", severity: "critical", label: "Broker 2 Agency Address", check: "present", next_action: "Draft an Amendment", email_text: "The address of agency or broker 2 is missing." },
      { field: "Name of Agency or Broker[1].Email", clause: "1", severity: "critical", label: "Broker 2 Email", check: "present", next_action: "Draft an Amendment", email_text: "The email address of broker 2 is missing." },
      { field: "Name of Agency or Broker[1].Licence Number", clause: "1", severity: "critical", label: "Broker 2 Licence Number", check: "present", next_action: "Draft an Amendment", email_text: "Broker 2 licence number is missing." },
      { field: "Signature Part - Agency/Broker[1].Signature present", clause: "15", severity: "critical", label: "Broker 2 Signature", check: "is_true", next_action: "Contact Broker Immediately", email_text: "Broker 2 signature is missing." },
      { field: "Signature Part - Agency/Broker[1].Signature date and time", clause: "15", severity: "critical", label: "Broker 2 Signing Date", check: "present", next_action: "Contact Broker Immediately", email_text: "The signing date for broker 2 at clause 15 is missing." },
      { field: "Signature Part - Agency/Broker[1].Signature location", clause: "15", severity: "critical", label: "Broker 2 Signing Location", check: "present", next_action: "Contact Broker Immediately", email_text: "The signing location for broker 2 at clause 15 is missing." }
    ]
  },

  // --- BROKER 3 ---
  {
    condition_field: "Name of Agency or Broker[2].Representative",
    label_prefix: "Broker 3",
    then_check: [
      { field: "Name of Agency or Broker[2].Name", clause: "1", severity: "critical", label: "Broker 3 Agency Name", check: "present", next_action: "Draft an Amendment", email_text: "The name of agency or broker 3 is missing." },
      { field: "Name of Agency or Broker[2].Representative", clause: "1", severity: "critical", label: "Broker 3 Represented By", check: "present", next_action: "Draft an Amendment", email_text: "The 'Represented by' field for broker 3 is missing." },
      { field: "Name of Agency or Broker[2].Address", clause: "1", severity: "critical", label: "Broker 3 Agency Address", check: "present", next_action: "Draft an Amendment", email_text: "The address of agency or broker 3 is missing." },
      { field: "Name of Agency or Broker[2].Email", clause: "1", severity: "critical", label: "Broker 3 Email", check: "present", next_action: "Draft an Amendment", email_text: "The email address of broker 3 is missing." },
      { field: "Name of Agency or Broker[2].Licence Number", clause: "1", severity: "critical", label: "Broker 3 Licence Number", check: "present", next_action: "Draft an Amendment", email_text: "Broker 3 licence number is missing." },
      { field: "Signature Part - Agency/Broker[2].Signature present", clause: "15", severity: "critical", label: "Broker 3 Signature", check: "is_true", next_action: "Contact Broker Immediately", email_text: "Broker 3 signature is missing." },
      { field: "Signature Part - Agency/Broker[2].Signature date and time", clause: "15", severity: "critical", label: "Broker 3 Signing Date", check: "present", next_action: "Contact Broker Immediately", email_text: "The signing date for broker 3 at clause 15 is missing." },
      { field: "Signature Part - Agency/Broker[2].Signature location", clause: "15", severity: "critical", label: "Broker 3 Signing Location", check: "present", next_action: "Contact Broker Immediately", email_text: "The signing location for broker 3 at clause 15 is missing." }
    ]
  },

  // --- BROKER 4 ---
  {
    condition_field: "Name of Agency or Broker[3].Representative",
    label_prefix: "Broker 4",
    then_check: [
      { field: "Name of Agency or Broker[3].Name", clause: "1", severity: "critical", label: "Broker 4 Agency Name", check: "present", next_action: "Draft an Amendment", email_text: "The name of agency or broker 4 is missing." },
      { field: "Name of Agency or Broker[3].Representative", clause: "1", severity: "critical", label: "Broker 4 Represented By", check: "present", next_action: "Draft an Amendment", email_text: "The 'Represented by' field for broker 4 is missing." },
      { field: "Name of Agency or Broker[3].Address", clause: "1", severity: "critical", label: "Broker 4 Agency Address", check: "present", next_action: "Draft an Amendment", email_text: "The address of agency or broker 4 is missing." },
      { field: "Name of Agency or Broker[3].Email", clause: "1", severity: "critical", label: "Broker 4 Email", check: "present", next_action: "Draft an Amendment", email_text: "The email address of broker 4 is missing." },
      { field: "Name of Agency or Broker[3].Licence Number", clause: "1", severity: "critical", label: "Broker 4 Licence Number", check: "present", next_action: "Draft an Amendment", email_text: "Broker 4 licence number is missing." },
      { field: "Signature Part - Agency/Broker[3].Signature present", clause: "15", severity: "critical", label: "Broker 4 Signature", check: "is_true", next_action: "Contact Broker Immediately", email_text: "Broker 4 signature is missing." },
      { field: "Signature Part - Agency/Broker[3].Signature date and time", clause: "15", severity: "critical", label: "Broker 4 Signing Date", check: "present", next_action: "Contact Broker Immediately", email_text: "The signing date for broker 4 at clause 15 is missing." },
      { field: "Signature Part - Agency/Broker[3].Signature location", clause: "15", severity: "critical", label: "Broker 4 Signing Location", check: "present", next_action: "Contact Broker Immediately", email_text: "The signing location for broker 4 at clause 15 is missing." }
    ]
  },

  // --- SPOUSE INTERVENTION (informational) ---
  {
    condition_field: "Intervention of the married or civil union spouse of the seller",
    label_prefix: "Spouse Intervention",
    severity_override: "info",
    then_check: [
      { field: "Intervention of the married or civil union spouse of the seller", clause: "15", severity: "info", label: "Spouse Intervention", check: "present", next_action: null, email_text: null }
    ]
  }
]
