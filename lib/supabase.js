// lib/supabase.js
// Single Supabase client — imported everywhere, never duplicated

export const SB_URL = 'https://ipufxgeffnldfnztxitw.supabase.co'
export const SB_KEY = 'sb_publishable_LiEQa4VRHPapcv1MprZfnw_Iw4Ft2Qh'

export function getAuthHeaders(extra = {}) {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('sb_access_token')
    : null
  return {
    'Content-Type': 'application/json',
    'apikey': SB_KEY,
    'Authorization': `Bearer ${token || SB_KEY}`,
    ...extra
  }
}

export async function sbRequest(path, method, body) {
  const resp = await fetch(SB_URL + path, {
    method,
    headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY },
    body: body ? JSON.stringify(body) : undefined
  })
  return { ok: resp.ok, data: await resp.json() }
}