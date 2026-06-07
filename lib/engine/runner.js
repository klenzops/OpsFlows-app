// lib/engine/runner.js
// Shared verification engine — used by all document types

export function getField(obj, path) {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let current = obj
  for (const part of parts) {
    if (current == null) return null
    current = current[part]
  }
  return current ?? null
}

function isPresent(value) {
  return value !== null && value !== undefined && value !== '' && value !== 'null'
}

function parseFlexDate(str) {
  if (!str || typeof str !== 'string') return null
  const direct = new Date(str)
  if (!isNaN(direct.getTime())) return direct
  // DD/MM/YYYY or DD-MM-YYYY (common Quebec form format)
  const dmy = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/)
  if (dmy) {
    const year = dmy[3].length === 2 ? 2000 + parseInt(dmy[3]) : parseInt(dmy[3])
    const result = new Date(year, parseInt(dmy[2]) - 1, parseInt(dmy[1]))
    if (!isNaN(result.getTime())) return result
  }
  return null
}

function evaluateCheck(rule, extraction) {
  const { check, field, format, seller_position } = rule
  let passed = false
  let detail = null
  let flagged = false

  switch (check) {

    case 'present': {
      const value = getField(extraction, field)
      passed = isPresent(value)
      detail = passed ? String(value).slice(0, 120) : null
      break
    }

    case 'present_and_format': {
      const value = getField(extraction, field)
      passed = isPresent(value)
      if (passed && format) {
        passed = format.test(String(value))
        detail = passed ? String(value) : `Found "${value}" — format invalid`
      } else {
        detail = passed ? String(value) : null
      }
      break
    }

    case 'present_and_date': {
      const value = getField(extraction, field)
      passed = isPresent(value)
      if (passed) {
        const looksLikeDate = /\d/.test(String(value))
        passed = looksLikeDate
        detail = passed ? String(value) : `Found "${value}" — not a valid date`
      }
      break
    }

    case 'present_and_date_not_expired': {
      const value = getField(extraction, field)
      passed = isPresent(value)
      if (passed) {
        const parsed = parseFlexDate(String(value))
        if (parsed) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          passed = parsed >= today
          detail = passed
            ? `${value} — valid`
            : `${value} — EXPIRED`
        } else {
          // Can't parse, but value is present — treat as present_and_date
          const looksLikeDate = /\d/.test(String(value))
          passed = looksLikeDate
          detail = passed ? String(value) : `Found "${value}" — not a valid date`
        }
      }
      break
    }

    case 'present_and_age_at_least_18': {
      const value = getField(extraction, field)
      passed = isPresent(value)
      if (passed) {
        const parsed = parseFlexDate(String(value))
        if (parsed) {
          const today = new Date()
          const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
          passed = parsed <= eighteenYearsAgo
          detail = passed
            ? `${value} — age verified ≥ 18`
            : `${value} — seller is under 18`
        } else {
          const looksLikeDate = /\d/.test(String(value))
          passed = looksLikeDate
          detail = passed ? String(value) : `Found "${value}" — not a valid date`
        }
      }
      break
    }

    case 'present_and_date_in_future': {
      const value = getField(extraction, field)
      passed = isPresent(value)
      if (passed) {
        const parsed = parseFlexDate(String(value))
        if (parsed) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          passed = parsed > today
          detail = passed
            ? `${value} — valid future date`
            : `${value} — date has already passed`
        } else {
          const looksLikeDate = /\d/.test(String(value))
          passed = looksLikeDate
          detail = passed ? String(value) : `Found "${value}" — not a valid date`
        }
      }
      break
    }

    case 'warning_if_present': {
      // Never fails — but flags content to admin if present
      const value = getField(extraction, field)
      passed = true
      if (isPresent(value)) {
        flagged = true
        detail = String(value).slice(0, 240)
      }
      break
    }

    case 'is_true': {
      const value = getField(extraction, field)
      passed = value === true
      detail = passed ? 'Signature present' : 'No signature found'
      break
    }

    case 'seller_sig_by_position': {
      const sigsArr = getField(extraction, 'Signature Part - Seller(s)') || []
      const pos = (seller_position || 1) - 1
      const sig = sigsArr[pos]
      const sigPresent = sig
        ? (sig['Signature present'] === true || sig['signature_present'] === true)
        : false
      passed = sigPresent
      detail = passed ? 'Signature present' : (sig ? 'Signature line blank' : 'Signature row not found')
      break
    }

    case 'at_least_one_signature': {
      const arr = getField(extraction, field)
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
      initialsArr.forEach(entry => {
        if (entry && entry.Seller) {
          const num = parseInt(entry.Seller)
          initialsMap[num] = entry.Initials ?? entry.initials ?? null
        }
      })
      const missing = []
      for (let i = 1; i <= sellerCount; i++) {
        const val = initialsMap[i]
        const hasInitials = isPresent(val) && String(val).trim() !== ''
        if (!hasInitials) missing.push(i)
      }
      passed = missing.length === 0
      detail = passed
        ? `Seller ${Array.from({ length: sellerCount }, (_, i) => i + 1).join(', ')} initialed`
        : `Seller ${missing.join(', ')} missing initials`
      break
    }

    default: {
      passed = false
      detail = `Unknown check type: ${check}`
    }
  }

  return { passed, detail, flagged }
}

export function runChecks(rules, conditionalRules, extraction) {
  const results = []
  const flaggedItems = []
  let criticalFails = 0

  for (const rule of rules) {
    const { passed, detail, flagged } = evaluateCheck(rule, extraction)

    if (!passed && rule.severity === 'critical') criticalFails++
    if (flagged) flaggedItems.push({ rule: rule.label, clause: rule.clause, value: detail })

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

  for (const condRule of conditionalRules) {
    const condValue = getField(extraction, condRule.condition_field)
    const condMet = isPresent(condValue)
    if (!condMet) continue

    for (const check of condRule.then_check) {
      const severity = condRule.severity_override || check.severity
      const { passed, detail, flagged } = evaluateCheck(check, extraction)

      if (!passed && severity === 'critical') criticalFails++
      if (flagged) flaggedItems.push({ rule: check.label, clause: check.clause || 'Conditional', value: detail })

      results.push({
        rule: check.label,
        clause: check.clause || 'Conditional',
        severity,
        passed,
        value: detail,
        field: check.field,
        next_action: !passed && check.next_action ? check.next_action : null,
        email_text: !passed && check.email_text ? check.email_text : null
      })
    }
  }

  return { results, criticalFails, flaggedItems }
}
