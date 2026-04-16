/**
 * Gemini API service — frontend only.
 * All Gemini calls go through /api/chat (Vercel serverless function).
 * The API key never touches the browser.
 *
 * All prompts follow Trumi's brand voice:
 * - Second person ("you", "your")
 * - Warm, encouraging, non-pressuring
 * - Never: "must", "should", "failed", "missed"
 */

/**
 * Creates a stateful multi-turn chat session with the character.
 * The returned sendMessage function maintains conversation history automatically.
 *
 * @param {string} characterName - The user's character name (shown in header)
 * @returns {{ sendMessage: (text: string) => Promise<string> }}
 */
export function createChatSession(characterName = 'Your Tru-mi') {
  // History stored locally and sent with every request to the serverless function
  const history = []

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
 * @param {Object} surveyResponses
 * @returns {Promise<string>} JSON array of goal objects
 */
export async function suggestGoals(surveyResponses) {
  const prompt = `
You are a compassionate personal growth companion. A user just completed a self-discovery survey.
Suggest 3–5 meaningful goals that genuinely align with who they are.

Tone: second person, warm, encouraging. Never use "must", "should", "failed".
Frame goals as possibilities, not obligations.

Survey responses:
${JSON.stringify(surveyResponses, null, 2)}

Return a JSON array: [{ "title": string, "why": string, "subGoals": string[] }]
  `.trim()
  return generate(prompt)
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
