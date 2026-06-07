// lib/ds/rules.js
// Verification rules for DS (Declarations by the Seller of the Immovable)

export const DS_RULES = [
  // --- IDENTIFICATION ---
  {
    field: "DS contract number", clause: "-", severity: "critical",
    check: "present_and_format", format: /^DS[\s\-]?\d+/i,
    label: "DS Contract Number",
    next_action: "Re-upload declaration form",
    email_text: "We're unable to retrieve the DS contract number. Please re-upload the Declaration by the Seller document."
  },
  {
    field: "Property Address", clause: "-", severity: "critical",
    check: "present",
    label: "Property Address",
    next_action: "Draft an Amendment",
    email_text: "The property address on the DS form is missing. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].Full Name", clause: "-", severity: "critical",
    check: "present",
    label: "Seller 1 Full Name",
    next_action: "Draft an Amendment",
    email_text: "The seller's full name on the DS form is missing. Please draft an amendment for correction."
  },

  // --- SECTION A: General Information ---
  {
    field: "A1 Number of dwellings", clause: "A1", severity: "critical",
    check: "present",
    label: "Number of Dwellings (A1)",
    next_action: "Complete the Declaration",
    email_text: "The number of dwellings (Section A1) is missing on the DS form. Please complete this field."
  },
  {
    field: "A2 Year of construction", clause: "A2", severity: "critical",
    check: "present",
    label: "Year of Construction (A2)",
    next_action: "Complete the Declaration",
    email_text: "The year of construction (Section A2) is missing on the DS form. Please complete this field."
  },

  // --- SECTION B: Building Components ---
  {
    field: "B1 Roof covering type", clause: "B1", severity: "critical",
    check: "present",
    label: "Roof Covering Type (B1)",
    next_action: "Complete the Declaration",
    email_text: "The roof covering type (Section B1) is missing on the DS form. Please complete this field."
  },
  {
    field: "B2 Foundation type", clause: "B2", severity: "critical",
    check: "present",
    label: "Foundation Type (B2)",
    next_action: "Complete the Declaration",
    email_text: "The foundation type (Section B2) is missing on the DS form. Please complete this field."
  },
  {
    field: "B4 Heating system type", clause: "B4", severity: "critical",
    check: "present",
    label: "Heating System Type (B4)",
    next_action: "Complete the Declaration",
    email_text: "The heating system type (Section B4) is missing on the DS form. Please complete this field."
  },
  {
    field: "B6 Electrical panel amperage", clause: "B6", severity: "critical",
    check: "present",
    label: "Electrical Panel Amperage (B6)",
    next_action: "Complete the Declaration",
    email_text: "The electrical panel amperage (Section B6) is missing on the DS form. Please complete this field."
  },
  {
    field: "B8 Sewage system", clause: "B8", severity: "critical",
    check: "present",
    label: "Sewage System (B8)",
    next_action: "Complete the Declaration",
    email_text: "The sewage system type (Section B8) is missing on the DS form. Please complete this field."
  },
  {
    field: "B9 Water supply", clause: "B9", severity: "critical",
    check: "present",
    label: "Water Supply (B9)",
    next_action: "Complete the Declaration",
    email_text: "The water supply source (Section B9) is missing on the DS form. Please complete this field."
  },

  // --- SECTION C: Known Defects (yes/no answers required) ---
  {
    field: "C1 Water infiltration", clause: "C1", severity: "critical",
    check: "present",
    label: "Water Infiltration Declaration (C1)",
    next_action: "Complete the Declaration",
    email_text: "The water infiltration question (Section C1) has not been answered on the DS form. Please complete this field."
  },
  {
    field: "C2 Foundation problems", clause: "C2", severity: "critical",
    check: "present",
    label: "Foundation Problems Declaration (C2)",
    next_action: "Complete the Declaration",
    email_text: "The foundation problems question (Section C2) has not been answered on the DS form."
  },
  {
    field: "C3 Roof problems", clause: "C3", severity: "critical",
    check: "present",
    label: "Roof Problems Declaration (C3)",
    next_action: "Complete the Declaration",
    email_text: "The roof problems question (Section C3) has not been answered on the DS form."
  },
  {
    field: "C5 Mould or air quality", clause: "C5", severity: "critical",
    check: "present",
    label: "Mould or Air Quality Declaration (C5)",
    next_action: "Complete the Declaration",
    email_text: "The mould or air quality question (Section C5) has not been answered on the DS form."
  },
  {
    field: "C8 Underground storage tank", clause: "C8", severity: "critical",
    check: "present",
    label: "Underground Storage Tank Declaration (C8)",
    next_action: "Complete the Declaration",
    email_text: "The underground storage tank question (Section C8) has not been answered on the DS form."
  },
  {
    field: "C10 Major work done", clause: "C10", severity: "critical",
    check: "present",
    label: "Major Work Done Declaration (C10)",
    next_action: "Complete the Declaration",
    email_text: "The major work done question (Section C10) has not been answered on the DS form."
  },

  // --- SECTION D: Legal Situation ---
  {
    field: "D1 Pre-emptive right", clause: "D1", severity: "critical",
    check: "present",
    label: "Pre-emptive Right Declaration (D1)",
    next_action: "Complete the Declaration",
    email_text: "The pre-emptive right question (Section D1) has not been answered on the DS form."
  },
  {
    field: "D2 Disputes or litigation", clause: "D2", severity: "critical",
    check: "present",
    label: "Disputes or Litigation Declaration (D2)",
    next_action: "Complete the Declaration",
    email_text: "The disputes or litigation question (Section D2) has not been answered on the DS form."
  },
  {
    field: "D4 Easements or real rights", clause: "D4", severity: "critical",
    check: "present",
    label: "Easements or Real Rights Declaration (D4)",
    next_action: "Complete the Declaration",
    email_text: "The easements or real rights question (Section D4) has not been answered on the DS form."
  },

  // --- SIGNATURES ---
  {
    field: "Signature Part - Seller(s)", clause: "Signatures", severity: "critical",
    check: "at_least_one_signature",
    label: "Seller Signature",
    next_action: "Contact Seller Immediately",
    email_text: "A seller's signature is missing on the DS form. Please have the seller sign and resubmit."
  },
  {
    field: "Signature Part - Seller(s)[0].Signature date and time", clause: "Signatures", severity: "critical",
    check: "present",
    label: "Seller 1 Signing Date",
    next_action: "Contact Seller Immediately",
    email_text: "The signing date for seller 1 is missing on the DS form."
  }
]

export const DS_CONDITIONAL_RULES = [
  // Seller 2 on DS form
  {
    condition_field: "Sellers[1].Full Name",
    label_prefix: "Seller 2",
    then_check: [
      { field: "Sellers[1].Full Name", clause: "-", severity: "critical", label: "Seller 2 Full Name", check: "present", next_action: "Draft an Amendment", email_text: "Seller 2 full name is missing on the DS form." },
      { field: "Signature Part - Seller(s)", clause: "Signatures", severity: "critical", label: "Seller 2 Signature", check: "seller_sig_by_position", seller_position: 2, next_action: "Contact Seller Immediately", email_text: "Seller 2 signature is missing on the DS form." },
      { field: "Signature Part - Seller(s)[1].Signature date and time", clause: "Signatures", severity: "critical", label: "Seller 2 Signing Date", check: "present", next_action: "Contact Seller Immediately", email_text: "The signing date for seller 2 is missing on the DS form." }
    ]
  },

  // Flag "Yes" answers to known-defect questions for admin review
  {
    condition_field: "C1 Water infiltration",
    label_prefix: "Water Infiltration (C1)",
    then_check: [
      { field: "C1 Water infiltration details", clause: "C1", severity: "info", label: "Water Infiltration Details", check: "warning_if_present", next_action: null, email_text: null }
    ]
  },
  {
    condition_field: "C2 Foundation problems",
    label_prefix: "Foundation Problems (C2)",
    then_check: [
      { field: "C2 Foundation problems details", clause: "C2", severity: "info", label: "Foundation Problem Details", check: "warning_if_present", next_action: null, email_text: null }
    ]
  },
  {
    condition_field: "C5 Mould or air quality",
    label_prefix: "Mould (C5)",
    then_check: [
      { field: "C5 Mould or air quality details", clause: "C5", severity: "info", label: "Mould or Air Quality Details", check: "warning_if_present", next_action: null, email_text: null }
    ]
  },
  {
    condition_field: "C8 Underground storage tank",
    label_prefix: "Underground Tank (C8)",
    then_check: [
      { field: "C8 Underground storage tank details", clause: "C8", severity: "info", label: "Underground Tank Details", check: "warning_if_present", next_action: null, email_text: null }
    ]
  },
  {
    condition_field: "D1 Pre-emptive right",
    label_prefix: "Pre-emptive Right (D1)",
    then_check: [
      { field: "D1 Pre-emptive right details", clause: "D1", severity: "info", label: "Pre-emptive Right Details", check: "warning_if_present", next_action: null, email_text: null }
    ]
  },
  {
    condition_field: "D2 Disputes or litigation",
    label_prefix: "Disputes (D2)",
    then_check: [
      { field: "D2 Disputes or litigation details", clause: "D2", severity: "info", label: "Disputes or Litigation Details", check: "warning_if_present", next_action: null, email_text: null }
    ]
  }
]
