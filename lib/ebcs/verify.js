// lib/ebcs/verify.js
// The verification engine — pure logic, no HTTP, no UI

import { EBCS_RULES, EBCS_CONDITIONAL_RULES } from './rules.js'

function getField(obj, path) {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let current = obj
  for (const part of parts) {
    if (current == null) return null
    current = current[part]
  }
  return current ?? null
}

export function verifyEBCS(extraction) {
  const results = []
  let criticalFails = 0

  for (const rule of EBCS_RULES) {
    let passed = false
    let detail = null

    switch (rule.check) {

      case 'present': {
        const value = getField(extraction, rule.field)
        passed = value !== null && value !== undefined && value !== '' && value !== 'null'
        detail = passed ? String(value).slice(0, 120) : null
        break
      }

      case 'present_and_format': {
        const value = getField(extraction, rule.field)
        passed = value !== null && value !== undefined && value !== '' && value !== 'null'
        if (passed && rule.format) {
          passed = rule.format.test(String(value))
          detail = passed ? String(value) : `Found "${value}" — format invalid`
        } else {
          detail = passed ? String(value) : null
        }
        break
      }

      case 'present_and_date': {
        const value = getField(extraction, rule.field)
        passed = value !== null && value !== undefined && value !== '' && value !== 'null'
        if (passed) {
          const looks_like_date = /\d/.test(String(value))
          passed = looks_like_date
          detail = passed ? String(value) : `Found "${value}" — not a valid date`
        }
        break
      }

      case 'is_true': {
        const value = getField(extraction, rule.field)
        passed = value === true
        detail = passed ? 'Signature present' : 'No signature found'
        break
      }

      case 'seller_sig_by_position': {
        const sigsArr = getField(extraction, 'Signature Part - Seller(s)') || []
        const pos = (rule.seller_position || 1) - 1
        const sig = sigsArr[pos]
        const sigPresent = sig
          ? (sig['Signature present'] === true || sig['signature_present'] === true)
          : false
        passed = sigPresent
        detail = passed ? 'Signature present' : (sig ? 'Signature line blank' : 'Signature row not found')
        break
      }

      case 'at_least_one_signature': {
        const arr = getField(extraction, rule.field)
        if (Array.isArray(arr)) {
          passed = arr.some(s => s && s['Signature present'] === true)
          detail = passed ? 'At least 1 seller signature present' : 'No seller signatures found'
        } else {
          passed = false
          detail = 'Signature section not found'
        }
        break
      }

      case 'seller_initials': {
        const initialsArr = getField(extraction, 'Seller(s) initials')
        if (!initialsArr || !Array.isArray(initialsArr) || initialsArr.length === 0) {
          passed = false
          detail = 'Initials section not found'
          break
        }
        const sellers = getField(extraction, 'Sellers') || []
        const sellerCount = Math.max(1, sellers.filter(s => s && s['Full Name']).length)
        const initialsMap = {}
        initialsArr.forEach(function(entry) {
          if (entry && entry.Seller) {
            const num = parseInt(entry.Seller)
            initialsMap[num] = entry.Initials ?? entry.initials ?? null
          }
        })
        const missing = []
        for (let i = 1; i <= sellerCount; i++) {
          const val = initialsMap[i]
          const hasInitials = val !== null && val !== undefined && String(val).trim() !== '' && String(val) !== 'null'
          if (!hasInitials) missing.push(i)
        }
        passed = missing.length === 0
        detail = passed
          ? 'Seller ' + Array.from({length: sellerCount}, (_, i) => i+1).join(', ') + ' initialed'
          : 'Seller ' + missing.join(', ') + ' missing initials'
        break
      }
    }

    if (!passed && rule.severity === 'critical') criticalFails++

    results.push({
      rule: rule.label,
      clause: rule.clause,
      severity: rule.severity,
      passed,
      value: detail,
      field: rule.field,
      next_action: !passed ? rule.next_action : null,
      email_text: !passed ? rule.email_text : null
    })
  }

  // Conditional rules
  for (const condRule of EBCS_CONDITIONAL_RULES) {
    const condValue = getField(extraction, condRule.condition_field)
    const condMet = condValue !== null && condValue !== undefined && condValue !== '' && condValue !== 'null'
    if (!condMet) continue

    for (const check of condRule.then_check) {
      const severity = condRule.severity_override || check.severity
      let passed = false
      let detail = null

      if (check.check === 'seller_sig_by_position') {
        const sigsArr = getField(extraction, 'Signature Part - Seller(s)') || []
        const pos = (check.seller_position || 1) - 1
        const sig = sigsArr[pos]
        const sigPresent = sig
          ? (sig['Signature present'] === true || sig['signature_present'] === true)
          : false
        passed = sigPresent
        detail = passed ? 'Signature present' : (sig ? 'Signature line blank' : 'Signature row not found')
      } else if (check.check === 'is_true') {
        const v = getField(extraction, check.field)
        passed = v === true
        detail = passed ? 'Signature present' : 'No signature found'
      } else {
        const v = getField(extraction, check.field)
        passed = v !== null && v !== undefined && v !== '' && v !== 'null'
        detail = passed ? String(v).slice(0, 120) : null
      }

      if (!passed && severity === 'critical') criticalFails++

      results.push({
        rule: check.label,
        clause: 'Conditional',
        severity,
        passed,
        value: detail,
        field: check.field,
        next_action: !passed && check.next_action ? check.next_action : null,
        email_text: !passed && check.email_text ? check.email_text : null
      })
    }
  }

  // Scoring
  const criticalResults = results.filter(r => r.severity === 'critical')
  const totalChecks = criticalResults.length
  const passedCount = criticalResults.filter(r => r.passed).length
  const score = totalChecks > 0 ? Math.round((passedCount / totalChecks) * 100) : 100
  const verdict = criticalFails === 0 ? 'COMPLETE' : criticalFails <= 3 ? 'MISSING_FIELDS' : 'FLAGGED'

  const failedChecks = results.filter(r => !r.passed && r.severity === 'critical')
  const missing = failedChecks.map(r => `[${r.clause}] ${r.rule}`)

  const seller1Name = getField(extraction, 'Sellers[0].Full Name') || 'Unknown Seller'
  const address     = getField(extraction, 'Property Address') || 'Unknown Address'
  const contractNum = getField(extraction, 'Brokerage contract number') || 'Unknown'
  const brokerEmail = getField(extraction, 'Name of Agency or Broker[0].Email') || null
  const brokerName  = getField(extraction, 'Name of Agency or Broker[0].Representative') || null

  const allBrokers = (extraction['Name of Agency or Broker'] || []).map(function(b) {
    return {
      name: b['Representative'] || b['Name'] || null,
      licence: b['Licence Number'] || null,
      email: b['Email'] || null,
      agency: b['Name'] || null
    }
  }).filter(function(b) { return b.name })

  const summary = criticalFails === 0
    ? `EBCS ${contractNum} for ${address} is fully compliant. All ${totalChecks} critical fields verified.`
    : `EBCS ${contractNum} for ${address} has ${criticalFails} critical issue(s). ${passedCount} of ${totalChecks} checks passed.`

  const failedEmailLines = failedChecks
    .filter(r => r.email_text)
    .map((r, i) => `${i + 1}. ${r.email_text}`)
    .join('\n')

  const brokerEmailBody = criticalFails === 0
    ? `Hi ${brokerName || 'there'},\n\nThank you for uploading your documents. After verification, your EBCS file for ${address} (${contractNum}) has passed all compliance checks.\n\nHave a great day,\nOpsFlows Compliance`
    : `Hi ${brokerName || 'there'},\n\nThank you for uploading your documents. After verification of your EBCS file for ${address} (${contractNum}), the following items require your attention:\n\n${failedEmailLines}\n\nPlease address these items as soon as possible to ensure compliance with OACIQ regulations.\n\nHave a great day,\nOpsFlows Compliance`

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
    all_brokers: allBrokers,
    document_type: 'EBCS'
  }
}