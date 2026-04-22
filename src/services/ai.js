/**
 * AI service — frontend only.
 * All AI calls proxy through Vercel serverless functions (/api/chat, /api/suggest-goals).
 * The Groq API key never touches the browser.
 *
 * All prompts follow Trumi's brand voice:
 * - Second person ("you", "your")
 * - Warm, encouraging, non-pressuring
 * - Never: "must", "should", "failed", "missed"
 */

/**
 * @param {string}   characterName  - The name shown in the header
 * @param {Array}    initialHistory - Pre-seeded history when resuming a saved chat.
 *                                   Each entry: { role: 'user'|'model', parts: [{text}] }
 */
export function createChatSession(characterName = 'Your Tru-mi', initialHistory = [], userContext = null) {
  // History stored locally and sent with every request to the serverless function
  const history = [...initialHistory]

  async function sendMessage(userText, attempt = 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history, characterName, userContext }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        const isRateLimit = res.status === 429
        if (isRateLimit && attempt < 4) {
          await new Promise(r => setTimeout(r, attempt * 6000))
          return sendMessage(userText, attempt + 1)
        }
        throw new Error(errBody.error ?? `Server error ${res.status}`)
      }

      const { reply } = await res.json()

      // Append both sides to local history for next turn
      history.push(
        { role: 'user',  parts: [{ text: userText }] },
        { role: 'model', parts: [{ text: reply    }] },
      )

      return reply
    } catch (err) {
      clearTimeout(timeout)
      if (err.name === 'AbortError') {
        throw new Error('Response timed out — try again')
      }
      throw err
    }
  }

  return { sendMessage }
}

// ── Onboarding & reflections ──────────────────────────────────────────────────
// These will route through a serverless function when implemented.
// Placeholder kept for future use.

/**
 * Analyze onboarding survey responses and suggest aligned goals.
 * @param {{ top10, top3, valueLooks, tradeoffs, alignment, obstacles }} surveyResponses
 * @returns {Promise<Array<{ title, values, why, description, subGoals }>>}
 */
export async function suggestGoals(surveyResponses) {
  const res = await fetch('/api/suggest-goals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(surveyResponses),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Server error ${res.status}`)
  }

  const { goals } = await res.json()
  return goals
}

/**
 * Ask AI to suggest a single personalised goal based on the user's values.
 * Used on the "What do you want to accomplish?" step of the goal creation flow.
 * @param {{ top3: string[], top10: string[] }} userValues
 * @returns {Promise<{ title: string, why: string }>}
 */
export async function suggestSingleGoal(userValues) {
  const { top3 = [], top10 = [] } = userValues

  const res = await fetch('/api/suggest-goal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ top3, top10 }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Server error ${res.status}`)
  }

  const { goal } = await res.json()
  return goal
}

/**
 * Generate a short personalised insight about a user's progress on a goal.
 * @param {{ title, unit, totalLogged, streak, thisWeekCount, daysIntoGoal }} data
 * @returns {Promise<string>}
 */
export async function getGoalInsight(data) {
  const res = await fetch('/api/goal-insight', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Server error ${res.status}`)
  }

  const { insight } = await res.json()
  return insight
}

/**
 * Get a contextual action button label and progress unit for a goal card.
 * Cached — callers should only call this when the goal doesn't already have meta stored.
 * @param {{ title: string, successType: string, executionStyle: string, weeklyTimes?: number }} goal
 * @returns {Promise<{ actionLabel: string, unit: string }>}
 */
export async function getGoalMeta({ title, successType, executionStyle, weeklyTimes }) {
  const res = await fetch('/api/goal-meta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, successType, executionStyle, weeklyTimes }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Server error ${res.status}`)
  }

  return res.json()
}

/**
 * Determine which of the user's values a goal aligns with, plus a short summary per value.
 * @param {{ goalTitle: string, values: string[] }} data
 * @returns {Promise<{ alignedValues: string[], summaries: { [value]: string } }>}
 */
export async function getValueAlignment({ goalTitle, values }) {
  const res = await fetch('/api/goal-value-alignment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goalTitle, values }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Server error ${res.status}`)
  }

  return res.json()
}

/**
 * Generate a reflective insight for a check-in.
 * @param {Object} checkinData
 * @param {'daily'|'weekly'|'monthly'} period
 * @returns {Promise<string>}
 */
export async function generateReflection(checkinData, period = 'daily') {
  const prompt = `
You are a compassionate personal growth companion. A user just completed their ${period} check-in.
Write a warm, brief (2–3 sentence) reflection.

Tone: second person, empathetic, never pressuring.
Celebrate any progress. If they struggled, lead with reassurance.

Check-in data:
${JSON.stringify(checkinData, null, 2)}
  `.trim()
  return generate(prompt)
}
