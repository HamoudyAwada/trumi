/**
 * Vercel Serverless Function — /api/suggest-goal
 * Returns a single personalised goal suggestion based on the user's values.
 *
 * POST body: { top3: string[], top10: string[] }
 * Returns:   { goal: { title: string, why: string } }
 */

import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are a compassionate personal growth companion inside the Trumi app.
A user wants help thinking of a goal that genuinely reflects who they are.

Your job: suggest ONE specific, meaningful, actionable goal based on their values.

Rules:
- The title must be specific and action-oriented — include a concrete frequency, duration, or measurable target (e.g. "Meditate 10 minutes each morning", "Call a friend once a week", "Run 3 times a week"). Never vague or abstract like "Be healthier" or "Grow as a person".
- Keep the title under 9 words.
- The "why" is one warm sentence in second person that explains why this fits them, based on their actual values. Never use "they", "their", or "them".
- The "values" array must contain 1–3 values chosen directly from the user's own value list that this goal most naturally supports. Do not invent new values — only use names from the list they provided.
- Return ONLY valid JSON. No markdown fences, no extra text.

Output format:
{ "title": "Short specific goal title", "values": ["Value1", "Value2"], "why": "One sentence in second person." }`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { top3 = [], top10 = [] } = req.body

  const hasValues = top3.length > 0 || top10.length > 0

  const userMessage = hasValues
    ? `The user's top 3 values: ${top3.join(', ')}\nOther values they care about: ${top10.filter(v => !top3.includes(v)).join(', ') || 'none listed'}\n\nSuggest one specific, actionable goal that genuinely fits who this person is.`
    : `The user hasn't specified their values yet. Suggest one specific, actionable personal growth goal that is meaningful and motivating for a young adult — something concrete, with a clear frequency or measurable target.`

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userMessage },
      ],
      max_tokens: 200,
      temperature: 0.85,  // slightly higher for variety on repeated taps
    })

    const raw     = completion.choices[0]?.message?.content ?? '{}'
    const cleaned = raw.replace(/```json?\n?/gi, '').replace(/```/g, '').trim()

    let goal
    try {
      goal = JSON.parse(cleaned)
      if (!goal.title) throw new Error('Missing title')
    } catch {
      console.error('[/api/suggest-goal] Failed to parse:', raw)
      return res.status(500).json({ error: 'Failed to parse suggestion' })
    }

    res.status(200).json({ goal })
  } catch (err) {
    console.error('[/api/suggest-goal]', err)
    const isQuota = err?.status === 429
    res.status(isQuota ? 429 : 500).json({
      error: isQuota ? 'Rate limit reached — try again in a moment' : 'Failed to generate suggestion',
    })
  }
}
