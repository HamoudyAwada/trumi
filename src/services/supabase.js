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

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Create a new Supabase auth user with email + password.
 * Throws on failure (duplicate email, weak password, etc.).
 */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

/**
 * Return the currently signed-in user, or null if guest.
 */
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ── Chat history ──────────────────────────────────────────────────────────────

/**
 * Create a new chat session row and return its UUID.
 * The initial AI greeting is saved immediately after calling this.
 */
export async function startChatSession(characterName) {
  const device_id = getDeviceId()
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ device_id, character_name: characterName, preview: '' })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

/**
 * Append one message to a session and update the session preview + timestamp.
 */
export async function appendChatMessage(sessionId, role, text) {
  const device_id = getDeviceId()

  // Save the message
  const { error: msgErr } = await supabase
    .from('chat_messages')
    .insert({ session_id: sessionId, role, content: text })
  if (msgErr) throw msgErr

  // Update session metadata
  const preview = text.length > 80 ? text.slice(0, 77) + '\u2026' : text
  await supabase
    .from('chat_sessions')
    .update({ preview, last_message_at: new Date().toISOString() })
    .eq('id', sessionId)
    .eq('device_id', device_id)
}

/**
 * Return all chat sessions for this device, newest first.
 */
export async function fetchChatSessions() {
  const device_id = getDeviceId()
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('id, character_name, preview, created_at, last_message_at')
    .eq('device_id', device_id)
    .order('last_message_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

/**
 * Return all messages for one session, oldest first.
 */
export async function fetchChatMessages(sessionId) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, role, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

/**
 * Delete a session (messages cascade automatically).
 */
export async function deleteChatSession(sessionId) {
  const device_id = getDeviceId()
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('device_id', device_id)
  if (error) throw error
}
