/**
 * Vercel Serverless Function — /api/suggest-goals
 * Analyses onboarding survey responses and returns 3–5 suggested goals.
 *
 * Expects POST body: { top10, top3, valueLooks, tradeoffs, alignment, obstacles }
 * Returns:          { goals: Array<{ title, why, description, subGoals }> }
 */

import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are a compassionate personal growth companion inside the Trumi app.
A user just completed a self-discovery survey about their values, what those values look like in practice, what they'd sacrifice for them, how well their life currently aligns with each one, and what obstacles they face.

Your job is to suggest 3 to 5 meaningful, actionable goals that genuinely reflect who this person is — not generic self-improvement advice.

Rules:
- Ground every goal in something they specifically said in their survey. Reference their actual values.
- Frame goals as personal possibilities, never obligations. Avoid "you must", "you should", "you need to".
- Keep each goal title short (under 8 words).
- The "why" field should speak directly to the user in second person ("you", "your") — like you read their answers carefully and saw something in them. Never use "they", "their", or "them".
- The "description" should be 1–2 sentences in second person, expanding on the goal in a warm, encouraging tone.
- The "values" field should list 1–3 of the user's own values (from their survey) that this goal directly connects to.
- Each goal should have 2–3 concrete sub-goals (small, specific actions or milestones), written in second person.
- Focus on the values that seem most out of alignment — those are where growth matters most right now.
- Return ONLY valid JSON. No markdown fences, no extra text.

Output format (strict JSON array):
[
  {
    "title": "Short goal title",
    "values": ["Value Name 1", "Value Name 2"],
    "why": "One sentence in second person — why this goal resonates with you based on what you shared.",
    "description": "1–2 sentences in second person expanding on what this could look like for you.",
    "subGoals": ["Specific sub-goal 1", "Specific sub-goal 2", "Specific sub-goal 3"]
  }
]`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { top10 = [], top3 = [], valueLooks = {}, tradeoffs = {}, alignment = {}, obstacles = {} } = req.body

  if (top3.length === 0 && top10.length === 0) {
    return res.status(400).json({ error: 'Survey data is required' })
  }

  // Build a human-readable summary of the survey for the AI
  const alignmentSummary = top3.map(v => {
    const score = alignment[v] ?? '?'
    const looks = valueLooks[v] ? `"${valueLooks[v]}"` : 'not described'
    const tradeoff = tradeoffs[v] ? `"${tradeoffs[v]}"` : 'not described'
    return `- ${v} (alignment: ${score}/10): what it looks like — ${looks}; what they'd sacrifice — ${tradeoff}`
  }).join('\n')

  const obstaclesSummary = Object.entries(obstacles)
    .map(([v, obs]) => `- ${v}: "${obs}"`)
    .join('\n')

  const userMessage = `Here is the user's survey summary:

Top 10 values they identified: ${top10.join(', ')}
Their 3 most important values: ${top3.join(', ')}

How each core value shows up in their life and what they'd sacrifice:
${alignmentSummary}

Obstacles they face:
${obstaclesSummary || 'None specified'}

Based on this, suggest 3–5 goals that would help this person grow in a way that feels authentic to who they are.`

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userMessage },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const raw = completion.choices[0]?.message?.content ?? '[]'

    // Parse the JSON response — strip any accidental markdown fences
    const cleaned = raw.replace(/```json?\n?/gi, '').replace(/```/g, '').trim()

    let goals
    try {
      goals = JSON.parse(cleaned)
      if (!Array.isArray(goals)) throw new Error('Not an array')
    } catch {
      console.error('[/api/suggest-goals] Failed to parse JSON:', raw)
      return res.status(500).json({ error: 'Failed to parse goal suggestions' })
    }

    res.status(200).json({ goals })
  } catch (err) {
    console.error('[/api/suggest-goals]', err)
    const isQuota = err?.status === 429
    res.status(isQuota ? 429 : 500).json({
      error: isQuota ? 'Rate limit reached — try again in a moment' : 'Failed to generate goals',
    })
  }
}
