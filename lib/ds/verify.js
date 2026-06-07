// lib/ds/verify.js
// DS verification engine — delegates check logic to lib/engine/runner.js

import { runChecks, getField } from '../engine/runner'
import { DS_RULES, DS_CONDITIONAL_RULES } from './rules'

export function verifyDS(extraction) {
  const { results, criticalFails, flaggedItems } = runChecks(DS_RULES, DS_CONDITIONAL_RULES, extraction)

  const criticalResults = results.filter(r => r.severity === 'critical')
  const totalChecks = criticalResults.length
  const passedCount = criticalResults.filter(r => r.passed).length
  const score = totalChecks > 0 ? Math.round((passedCount / totalChecks) * 100) : 100
  const verdict = criticalFails === 0 ? 'COMPLETE' : criticalFails <= 3 ? 'MISSING_FIELDS' : 'FLAGGED'

  const failedChecks = results.filter(r => !r.passed && r.severity === 'critical')
  const missing = failedChecks.map(r => `[${r.clause}] ${r.rule}`)

  const seller1Name  = getField(extraction, 'Sellers[0].Full Name') || 'Unknown Seller'
  const address      = getField(extraction, 'Property Address') || 'Unknown Address'
  const contractNum  = getField(extraction, 'DS contract number') || 'Unknown'

  const summary = criticalFails === 0
    ? `DS ${contractNum} for ${address} is complete. All ${totalChecks} critical fields verified.`
    : `DS ${contractNum} for ${address} has ${criticalFails} critical issue(s). ${passedCount} of ${totalChecks} checks passed.`

  const failedEmailLines = failedChecks
    .filter(r => r.email_text)
    .map((r, i) => `${i + 1}. ${r.email_text}`)
    .join('\n')

  const emailBody = criticalFails === 0
    ? `Hi there,\n\nThe Declaration by the Seller (DS) for ${address} (${contractNum}) has passed all required checks.\n\nHave a great day,\nOpsFlows Compliance`
    : `Hi there,\n\nThe Declaration by the Seller (DS) for ${address} (${contractNum}) has the following items requiring attention:\n\n${failedEmailLines}\n\nPlease address these items to ensure compliance with OACIQ regulations.\n\nHave a great day,\nOpsFlows Compliance`

  return {
    verdict,
    score,
    checks_run: totalChecks,
    critical_fails: criticalFails,
    property_address: address,
    seller_name: seller1Name,
    contract_number: contractNum,
    missing_items: missing,
    ok_items: results.filter(r => r.passed).map(r => `${r.rule}: ${r.value || '✓'}`),
    flagged_items: flaggedItems,
    failed_checks: failedChecks,
    summary,
    email_body: emailBody,
    check_results: results,
    verified_at: new Date().toISOString(),
    document_type: 'DS'
  }
}
