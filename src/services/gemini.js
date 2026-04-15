/**
 * Gemini API service
 *
 * Set VITE_GEMINI_API_KEY in your .env file before using any of these functions.
 * Copy .env.example to .env to get started.
 *
 * All prompts must use warm, second-person, non-pressuring language.
 * Never include words like "must", "should", "failed", or "missed".
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

async function generate(prompt) {
  if (!API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is not set. Add it to your .env file.')
  }

  const response = await fetch(`${API_BASE}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

/**
 * Analyze onboarding survey responses and suggest aligned goals.
 * @param {Object} surveyResponses - Key/value pairs from the onboarding survey
 * @returns {Promise<string>} AI-generated goal suggestions
 */
export async function suggestGoals(surveyResponses) {
  const prompt = `
You are a compassionate personal growth companion. A user has just completed a self-discovery survey.
Based on their responses below, suggest 3–5 meaningful goals that genuinely align with who they are.

Tone rules:
- Speak in second person ("you", "your")
- Warm, encouraging, empathetic
- Never use: "must", "should", "you need to", "you failed"
- Always celebrate small steps
- Frame goals as possibilities, not obligations

Survey responses:
${JSON.stringify(surveyResponses, null, 2)}

Return a JSON array of goal objects with this shape:
[{ "title": string, "why": string, "subGoals": string[] }]
  `.trim()

  return generate(prompt)
}

/**
 * Generate a reflective insight for a daily/weekly/monthly check-in.
 * @param {Object} checkinData - User's check-in responses
 * @param {'daily'|'weekly'|'monthly'} period
 * @returns {Promise<string>} Personalized reflection
 */
export async function generateReflection(checkinData, period = 'daily') {
  const prompt = `
You are a compassionate personal growth companion. A user has just completed their ${period} check-in.
Write a warm, brief (2–3 sentence) reflection on their responses.

Tone rules:
- Second person ("you", "your")
- Warm, empathetic, never pressuring
- Celebrate any progress, no matter how small
- If they struggled, respond with reassurance — not redirection to productivity

Check-in data:
${JSON.stringify(checkinData, null, 2)}
  `.trim()

  return generate(prompt)
}
