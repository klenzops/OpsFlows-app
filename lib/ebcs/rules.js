// lib/ebcs/rules.js
// The 19 verification rules + conditional rules for EBCS

export const EBCS_RULES = [
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
  {
    field: "Contract End Date", clause: "2.1", severity: "critical",
    check: "present_and_date",
    label: "Contract End Date",
    next_action: "Draft an Amendment",
    email_text: "The date the contract ends at clause 2.1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Seller(s) initials", clause: "-", severity: "critical",
    check: "seller_initials",
    label: "Seller 1 Initials",
    next_action: "Contact Seller Immediately",
    email_text: "A seller(s) initials is missing. Please have the seller sign and resubmit."
  },
  {
    field: "Sellers[0].Full Name", clause: "1", severity: "critical",
    check: "present",
    label: "Seller 1 Full Name",
    next_action: "Draft an Amendment",
    email_text: "The Full Name of the seller(s) is missing. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].Address", clause: "1", severity: "critical",
    check: "present",
    label: "Seller 1 Address",
    next_action: "Draft an Amendment",
    email_text: "The address of seller 1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Signature Part - Seller(s)", clause: "15", severity: "critical",
    check: "at_least_one_signature",
    label: "Seller 1 Signature",
    next_action: "Contact Seller Immediately",
    email_text: "A seller(s) signature is missing. Please have the seller sign and resubmit."
  },
  {
    field: "Signature Part - Agency/Broker[0].Signature present", clause: "15", severity: "critical",
    check: "is_true",
    label: "Broker 1 Signature",
    next_action: "Contact Broker Immediately",
    email_text: "A broker(s) signature is missing. Please have the broker sign and resubmit."
  },
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
  {
    field: "Asking Price", clause: "4.1", severity: "critical",
    check: "present",
    label: "Asking Price",
    next_action: "Draft an Amendment",
    email_text: "The asking price at clause 4.1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].ID type", clause: "1.1", severity: "critical",
    check: "present",
    label: "Seller 1 ID Type",
    next_action: "Draft an Amendment",
    email_text: "The Seller ID type at clause 1.1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].ID Document Number", clause: "1.1", severity: "critical",
    check: "present",
    label: "Seller 1 ID Document Number",
    next_action: "Draft an Amendment",
    email_text: "The Seller ID document number at clause 1.1 is missing/invalid. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].ID expiry date", clause: "1.1", severity: "critical",
    check: "present",
    label: "Seller 1 ID Expiry Date",
    next_action: "Draft an Amendment",
    email_text: "The Seller ID document expiration at clause 1.1 is missing/invalid. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].Date of Birth", clause: "1.1", severity: "critical",
    check: "present",
    label: "Seller 1 Date of Birth",
    next_action: "Draft an Amendment",
    email_text: "The Seller Date of Birth at clause 1.1 is missing/invalid. Please draft an amendment for correction."
  },
  {
    field: "Sellers[0].Profession or Principal Activity", clause: "1.1", severity: "critical",
    check: "present",
    label: "Seller 1 Profession or Principal Activity",
    next_action: "Draft an Amendment",
    email_text: "The Seller's Profession or Principal Activity at clause 1.1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Remuneration", clause: "7.1", severity: "critical",
    check: "present",
    label: "Remuneration",
    next_action: "Draft an Amendment",
    email_text: "The remuneration at clause 7.1 is missing/invalid. Please draft an amendment for correction."
  },
  {
    field: "Shared remuneration", clause: "7.3", severity: "critical",
    check: "present",
    label: "Shared Remuneration",
    next_action: "Draft an Amendment",
    email_text: "The shared remuneration at clause 7.3 is missing/invalid. Please draft an amendment for correction."
  },
  {
    field: "Name of Agency or Broker[0].Name", clause: "1", severity: "critical",
    check: "present",
    label: "Broker 1 Agency Name",
    next_action: "Draft an Amendment",
    email_text: "The Name of agency or broker at clause 1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Name of Agency or Broker[0].Address", clause: "1", severity: "critical",
    check: "present",
    label: "Broker 1 Agency Address",
    next_action: "Draft an Amendment",
    email_text: "The Address of the agency or broker at clause 1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Name of Agency or Broker[0].Licence Number", clause: "1", severity: "critical",
    check: "present",
    label: "Broker 1 Licence Number",
    next_action: "Draft an Amendment",
    email_text: "The broker licence number at clause 1 is missing. Please draft an amendment for correction."
  },
  {
    field: "Goods and Services Tax and the Quebec Sales Tax", clause: "4.2", severity: "critical",
    check: "present",
    label: "GST/QST Status",
    next_action: "Draft an Amendment",
    email_text: "The GST/QST at clause 4.2 is missing. Please draft an amendment for correction."
  },
  {
    field: "Pre-emptive rights", clause: "8.1", severity: "critical",
    check: "present",
    label: "Pre-emptive Rights",
    next_action: "Draft an Amendment",
    email_text: "The Pre-emptive rights at clause 8.1 is missing. Please draft an amendment for correction."
  }
]

export const EBCS_CONDITIONAL_RULES = [
  {
    condition_field: "Sellers[1].Full Name",
    label_prefix: "Seller 2",
    seller_position: 2,
    then_check: [
      { field: "Sellers[1].Full Name", severity: "critical", label: "Seller 2 Full Name", check: "present", next_action: "Draft an Amendment", email_text: "Seller 2 full name is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].Address", severity: "critical", label: "Seller 2 Address", check: "present", next_action: "Draft an Amendment", email_text: "Seller 2 address is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].ID type", severity: "critical", label: "Seller 2 ID Type", check: "present", next_action: "Draft an Amendment", email_text: "The seller 2 ID type is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].ID Document Number", severity: "critical", label: "Seller 2 ID Document Number", check: "present", next_action: "Draft an Amendment", email_text: "The seller 2 ID document number is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].ID expiry date", severity: "critical", label: "Seller 2 ID Expiry Date", check: "present", next_action: "Draft an Amendment", email_text: "The seller 2 ID expiry date is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].Date of Birth", severity: "critical", label: "Seller 2 Date of Birth", check: "present", next_action: "Draft an Amendment", email_text: "The seller 2 date of birth is missing. Please draft an amendment for correction." },
      { field: "Sellers[1].Profession or Principal Activity", severity: "critical", label: "Seller 2 Profession or Principal Activity", check: "present", next_action: "Draft an Amendment", email_text: "The seller 2 profession or principal activity is missing. Please draft an amendment for correction." },
      { field: "Signature Part - Seller(s)", severity: "critical", label: "Seller 2 Signature", check: "seller_sig_by_position", seller_position: 2, next_action: "Contact Seller Immediately", email_text: "Seller 2 signature is missing. Please have the seller sign and resubmit." }
    ]
  },
  {
    condition_field: "Sellers[2].Full Name",
    label_prefix: "Seller 3",
    seller_position: 3,
    then_check: [
      { field: "Sellers[2].Full Name", severity: "critical", label: "Seller 3 Full Name", check: "present", next_action: "Draft an Amendment", email_text: "Seller 3 full name is missing. Please draft an amendment for correction." },
      { field: "Sellers[2].Address", severity: "critical", label: "Seller 3 Address", check: "present", next_action: "Draft an Amendment", email_text: "Seller 3 address is missing. Please draft an amendment for correction." },
      { field: "Sellers[2].ID type", severity: "critical", label: "Seller 3 ID Type", check: "present", next_action: "Draft an Amendment", email_text: "The seller 3 ID type is missing. Please draft an amendment for correction." },
      { field: "Sellers[2].ID Document Number", severity: "critical", label: "Seller 3 ID Document Number", check: "present", next_action: "Draft an Amendment", email_text: "The seller 3 ID document number is missing. Please draft an amendment for correction." },
      { field: "Sellers[2].ID expiry date", severity: "critical", label: "Seller 3 ID Expiry Date", check: "present", next_action: "Draft an Amendment", email_text: "The seller 3 ID expiry date is missing. Please draft an amendment for correction." },
      { field: "Sellers[2].Date of Birth", severity: "critical", label: "Seller 3 Date of Birth", check: "present", next_action: "Draft an Amendment", email_text: "The seller 3 date of birth is missing. Please draft an amendment for correction." },
      { field: "Sellers[2].Profession or Principal Activity", severity: "critical", label: "Seller 3 Profession or Principal Activity", check: "present", next_action: "Draft an Amendment", email_text: "The seller 3 profession or principal activity is missing. Please draft an amendment for correction." },
      { field: "Signature Part - Seller(s)", severity: "critical", label: "Seller 3 Signature", check: "seller_sig_by_position", seller_position: 3, next_action: "Contact Seller Immediately", email_text: "Seller 3 signature is missing. Please have the seller sign and resubmit." }
    ]
  },
  {
    condition_field: "Sellers[3].Full Name",
    label_prefix: "Seller 4",
    seller_position: 4,
    then_check: [
      { field: "Sellers[3].Full Name", severity: "critical", label: "Seller 4 Full Name", check: "present", next_action: "Draft an Amendment", email_text: "Seller 4 full name is missing. Please draft an amendment for correction." },
      { field: "Sellers[3].Address", severity: "critical", label: "Seller 4 Address", check: "present", next_action: "Draft an Amendment", email_text: "Seller 4 address is missing. Please draft an amendment for correction." },
      { field: "Sellers[3].ID type", severity: "critical", label: "Seller 4 ID Type", check: "present", next_action: "Draft an Amendment", email_text: "The seller 4 ID type is missing. Please draft an amendment for correction." },
      { field: "Sellers[3].ID Document Number", severity: "critical", label: "Seller 4 ID Document Number", check: "present", next_action: "Draft an Amendment", email_text: "The seller 4 ID document number is missing. Please draft an amendment for correction." },
      { field: "Sellers[3].ID expiry date", severity: "critical", label: "Seller 4 ID Expiry Date", check: "present", next_action: "Draft an Amendment", email_text: "The seller 4 ID expiry date is missing. Please draft an amendment for correction." },
      { field: "Sellers[3].Date of Birth", severity: "critical", label: "Seller 4 Date of Birth", check: "present", next_action: "Draft an Amendment", email_text: "The seller 4 date of birth is missing. Please draft an amendment for correction." },
      { field: "Sellers[3].Profession or Principal Activity", severity: "critical", label: "Seller 4 Profession or Principal Activity", check: "present", next_action: "Draft an Amendment", email_text: "The seller 4 profession or principal activity is missing. Please draft an amendment for correction." },
      { field: "Signature Part - Seller(s)", severity: "critical", label: "Seller 4 Signature", check: "seller_sig_by_position", seller_position: 4, next_action: "Contact Seller Immediately", email_text: "Seller 4 signature is missing. Please have the seller sign and resubmit." }
    ]
  },
  {
    condition_field: "Name of Agency or Broker[1].Representative",
    label_prefix: "Broker 2",
    then_check: [
      { field: "Name of Agency or Broker[1].Name", severity: "critical", label: "Broker 2 Agency Name", check: "present", next_action: "Draft an Amendment", email_text: "The name of agency or broker 2 is missing. Please draft an amendment for correction." },
      { field: "Name of Agency or Broker[1].Address", severity: "critical", label: "Broker 2 Agency Address", check: "present", next_action: "Draft an Amendment", email_text: "The address of agency or broker 2 is missing. Please draft an amendment for correction." },
      { field: "Name of Agency or Broker[1].Licence Number", severity: "critical", label: "Broker 2 Licence Number", check: "present", next_action: "Draft an Amendment", email_text: "Broker 2 licence number is missing. Please draft an amendment for correction." },
      { field: "Signature Part - Agency/Broker[1].Signature present", severity: "critical", label: "Broker 2 Signature", check: "is_true", next_action: "Contact Broker Immediately", email_text: "Broker 2 signature is missing. Please have the broker sign and resubmit." }
    ]
  },
  {
    condition_field: "Name of Agency or Broker[2].Representative",
    label_prefix: "Broker 3",
    then_check: [
      { field: "Name of Agency or Broker[2].Name", severity: "critical", label: "Broker 3 Agency Name", check: "present", next_action: "Draft an Amendment", email_text: "The name of agency or broker 3 is missing. Please draft an amendment for correction." },
      { field: "Name of Agency or Broker[2].Address", severity: "critical", label: "Broker 3 Agency Address", check: "present", next_action: "Draft an Amendment", email_text: "The address of agency or broker 3 is missing. Please draft an amendment for correction." },
      { field: "Name of Agency or Broker[2].Licence Number", severity: "critical", label: "Broker 3 Licence Number", check: "present", next_action: "Draft an Amendment", email_text: "Broker 3 licence number is missing. Please draft an amendment for correction." },
      { field: "Signature Part - Agency/Broker[2].Signature present", severity: "critical", label: "Broker 3 Signature", check: "is_true", next_action: "Contact Broker Immediately", email_text: "Broker 3 signature is missing. Please have the broker sign and resubmit." }
    ]
  },
  {
    condition_field: "Name of Agency or Broker[3].Representative",
    label_prefix: "Broker 4",
    then_check: [
      { field: "Name of Agency or Broker[3].Name", severity: "critical", label: "Broker 4 Agency Name", check: "present", next_action: "Draft an Amendment", email_text: "The name of agency or broker 4 is missing. Please draft an amendment for correction." },
      { field: "Name of Agency or Broker[3].Address", severity: "critical", label: "Broker 4 Agency Address", check: "present", next_action: "Draft an Amendment", email_text: "The address of agency or broker 4 is missing. Please draft an amendment for correction." },
      { field: "Name of Agency or Broker[3].Licence Number", severity: "critical", label: "Broker 4 Licence Number", check: "present", next_action: "Draft an Amendment", email_text: "Broker 4 licence number is missing. Please draft an amendment for correction." },
      { field: "Signature Part - Agency/Broker[3].Signature present", severity: "critical", label: "Broker 4 Signature", check: "is_true", next_action: "Contact Broker Immediately", email_text: "Broker 4 signature is missing. Please have the broker sign and resubmit." }
    ]
  },
  {
    condition_field: "Intervention of the married or civil union spouse of the seller",
    label_prefix: "Spouse Intervention",
    severity_override: "info",
    then_check: [
      { field: "Intervention of the married or civil union spouse of the seller", severity: "info", label: "Spouse Intervention", check: "present", next_action: null, email_text: null }
    ]
  }
]
