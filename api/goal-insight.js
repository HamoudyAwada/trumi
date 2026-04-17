/**
 * Vercel Serverless Function — /api/goal-insight
 * Generates a short personalised insight about a user's progress on a goal.
 *
 * POST body: {
 *   title:         string   — goal title
 *   unit:          string   — e.g. "Minutes", "Runs"
 *   totalLogged:   number   — total days fully completed
 *   streak:        number   — current consecutive-day streak
 *   thisWeekCount: number   — days logged this week
 *   daysIntoGoal:  number   — days since goal was started
 * }
 * Returns: { insight: string }
 */

import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are a compassionate personal growth companion inside the Trumi app.
A user is tracking a personal goal. Write ONE short insight (1–2 sentences, max 25 words) about how they're doing.

Rules:
- Second person only ("you", "your"). Never "they" or "them".
- Warm, encouraging, and specific to their actual data. Never generic.
- Never use "must", "should", "need to", "failed", "missed", or any language of pressure or obligation.
- If they have a streak, celebrate it. If their week count is low, be gentle and reassuring — not pushy.
- If they're early in the goal, acknowledge that starting is the hardest part.
- Keep it under 25 words. No fluff.
- Return ONLY the insight text — no JSON, no quotes, no labels.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    title         = '',
    unit          = 'Sessions',
    totalLogged   = 0,
    streak        = 0,
    thisWeekCount = 0,
    daysIntoGoal  = 0,
  } = req.body

  if (!title.trim()) {
    return res.status(400).json({ error: 'title is required' })
  }

  const userMessage = [
    `Goal: "${title}"`,
    `Unit: ${unit}`,
    `Total sessions completed: ${totalLogged}`,
    `Current streak: ${streak} day${streak !== 1 ? 's' : ''}`,
    `Logged this week: ${thisWeekCount} day${thisWeekCount !== 1 ? 's' : ''}`,
    `Days since goal started: ${daysIntoGoal}`,
  ].join('\n')

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userMessage },
      ],
      max_tokens: 60,
      temperature: 0.7,
    })

    const insight = completion.choices[0]?.message?.content?.trim() ?? ''

    if (!insight) {
      return res.status(500).json({ error: 'Empty response from AI' })
    }

    res.status(200).json({ insight })
  } catch (err) {
    console.error('[/api/goal-insight]', err)
    const isQuota = err?.status === 429
    res.status(isQuota ? 429 : 500).json({
      error: isQuota ? 'Rate limit reached — try again in a moment' : 'Failed to generate insight',
    })
  }
}
