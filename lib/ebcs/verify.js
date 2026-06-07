// lib/ebcs/verify.js
// EBCS verification engine — delegates check logic to lib/engine/runner.js

import { runChecks, getField } from '../engine/runner'
import { EBCS_RULES, EBCS_CONDITIONAL_RULES } from './rules'

export function verifyEBCS(extraction) {
  const { results, criticalFails, flaggedItems } = runChecks(EBCS_RULES, EBCS_CONDITIONAL_RULES, extraction)

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

  const allBrokers = (extraction['Name of Agency or Broker'] || []).map(b => ({
    name:    b['Representative'] || b['Name'] || null,
    licence: b['Licence Number'] || null,
    email:   b['Email'] || null,
    agency:  b['Name'] || null
  })).filter(b => b.name)

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
    flagged_items: flaggedItems,
    failed_checks: failedChecks,
    summary,
    broker_email_body: brokerEmailBody,
    check_results: results,
    verified_at: new Date().toISOString(),
    all_brokers: allBrokers,
    document_type: 'EBCS'
  }
}
