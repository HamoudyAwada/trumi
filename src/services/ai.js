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
export function createChatSession(characterName = 'Your Tru-mi', initialHistory = []) {
  // History stored locally and sent with every request to the serverless function
  const history = [...initialHistory]

  async function sendMessage(userText, attempt = 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history, characterName }),
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
 * @returns {Promise<Array<{ title, why, description, subGoals }>>}
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
