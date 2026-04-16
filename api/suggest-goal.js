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

Title rules — read carefully:
- Must be 7–12 words. Titles shorter than 7 words are REJECTED.
- Must follow this pattern: [action verb] + [specific activity] + [frequency or measurable target].
  Good: "Write in a journal for 10 minutes every morning"
  Good: "Cook a new recipe from scratch once a week"
  Good: "Go for a 30-minute walk outside three times a week"
  Good: "Read 20 pages of a non-fiction book each night"
  Good: "Spend one hour on a personal creative project every weekend"
  Good: "Call or text a close friend at least once a week"
  Good: "Practise a new language skill for 15 minutes every day"
  Good: "Save $50 each week toward a personal goal"
  REJECTED (too vague, too short): "Be healthier", "Read more", "Exercise regularly", "Grow personally", "Stay connected"
- Draw from diverse life domains — fitness, creativity, relationships, learning, finances, mindfulness, career, community — don't default to the same area every time.
- Use the user's actual values to choose a domain that genuinely fits them.

Other rules:
- The "why" is one warm sentence in second person explaining why this fits them, referencing their actual values. Never use "they", "their", or "them".
- The "values" array must contain 1–3 values chosen directly from the user's own value list. Do not invent values.
- Return ONLY valid JSON. No markdown fences, no extra text.

Output format:
{ "title": "Specific goal title between 7 and 12 words", "values": ["Value1", "Value2"], "why": "One warm sentence in second person." }`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { top3 = [], top10 = [] } = req.body

  const hasValues = top3.length > 0 || top10.length > 0

  const userMessage = hasValues
    ? `The user's top 3 values: ${top3.join(', ')}\nOther values they care about: ${top10.filter(v => !top3.includes(v)).join(', ') || 'none listed'}\n\nSuggest one specific, focused goal (7–12 words) that genuinely fits who this person is. Pick a life domain that connects naturally to their values — don't default to a generic wellness or exercise goal unless it truly fits.`
    : `The user hasn't specified their values yet. Suggest one specific, focused personal growth goal (7–12 words) that is meaningful and motivating for a young adult. Pick from a diverse range of life domains — creativity, relationships, learning, finances, mindfulness, community, career, or physical health.`

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userMessage },
      ],
      max_tokens: 200,
      temperature: 1.0,   // higher for domain variety on repeated taps
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
