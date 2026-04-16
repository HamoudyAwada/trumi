import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Returns a stable device ID — created once, stored in localStorage forever
export function getDeviceId() {
  let id = localStorage.getItem('trumi_device_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('trumi_device_id', id)
  }
  return id
}

// Save all onboarding responses for this device
export async function saveOnboardingResponses({ top10, top3, valueLooks, tradeoffs, alignment, obstacles }) {
  const device_id = getDeviceId()

  const { error } = await supabase
    .from('onboarding_responses')
    .upsert(
      { device_id, top10, top3, value_looks: valueLooks, tradeoffs, alignment, obstacles },
      { onConflict: 'device_id' }
    )

  if (error) throw error
}

// Check if this device has already completed onboarding
export async function hasCompletedOnboarding() {
  const device_id = getDeviceId()

  const { data, error } = await supabase
    .from('onboarding_responses')
    .select('id')
    .eq('device_id', device_id)
    .maybeSingle()

  if (error) throw error
  return data !== null
}

// Fetch this device's onboarding responses (for future use in AI suggestions, etc.)
export async function getOnboardingResponses() {
  const device_id = getDeviceId()

  const { data, error } = await supabase
    .from('onboarding_responses')
    .select('*')
    .eq('device_id', device_id)
    .maybeSingle()

  if (error) throw error
  return data
}
