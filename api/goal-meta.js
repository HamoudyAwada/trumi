/**
 * Vercel Serverless Function — /api/goal-meta
 * Given a goal title + context, returns UI metadata for the GoalCard.
 *
 * POST body: { title: string, successType: string, executionStyle: string, weeklyTimes?: number }
 * Returns:   { actionLabel: string | null, unit: string, progressTarget: number }
 *
 * actionLabel    — past-tense verb phrase for the quick-complete button, e.g. "Meditated", "Ran Today"
 *                  Return null if the goal has no clear single daily action to quick-complete.
 * unit           — plural noun for the tracked unit, e.g. "Minutes", "Runs", "Pages", "Days"
 * progressTarget — the number extracted from the goal that represents a full daily session, e.g. 10
 */

import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are a helper inside the Trumi personal growth app.
A user has created a goal. Return three fields that power the goal tracking card.

1. actionLabel — text for a quick-complete button the user taps when they finished today's session.
   - Past-tense verb phrase, 1–3 words. Describes completing ONE session of the activity today.
   - Examples: "Meditated" · "Ran Today" · "Journaled" · "Played Guitar" · "Worked Out" · "Read Today"
   - The label must be specific to the activity — never generic like "Logged" or "Done" or "Completed".
   - If the goal is too abstract or vague to have a single daily completable action (e.g. "Be more patient", "Improve my mindset"), return null.

2. unit — short plural noun for what one session is measured in, used in the progress tracker.
   - 1–2 words. No numbers. Match the goal's activity.
   - Examples: "Minutes" · "Runs" · "Sessions" · "Pages" · "Steps" · "Workouts" · "Days"
   - Use "Sessions" when no specific unit is mentioned. Use "Days" only as a last resort.

3. progressTarget — the number from the goal title representing one full daily session.
   - Read for a number: "10 minutes" → 10, "5km" → 5, "20 pages" → 20, "3 times a week" → 3.
   - If no number is in the title, use 1 (one full session = 100%).
   - Always a positive integer.

Return ONLY valid JSON. No markdown fences. No extra text.
Format: { "actionLabel": "Meditated" | null, "unit": "Minutes", "progressTarget": 10 }`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { title = '', successType = '', executionStyle = '', weeklyTimes } = req.body

  if (!title.trim()) {
    return res.status(400).json({ error: 'title is required' })
  }

  const context = [
    `Goal: "${title}"`,
    successType    ? `Success type: ${successType}` : '',
    executionStyle ? `Execution style: ${executionStyle}` : '',
    weeklyTimes    ? `Target: ${weeklyTimes} times per week` : '',
  ].filter(Boolean).join('\n')

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: context },
      ],
      max_tokens: 80,
      temperature: 0.2,
    })

    const raw     = completion.choices[0]?.message?.content ?? '{}'
    const cleaned = raw.replace(/```json?\n?/gi, '').replace(/```/g, '').trim()

    let meta
    try {
      meta = JSON.parse(cleaned)
      if (!meta.unit) throw new Error('Missing unit field')
      // actionLabel may legitimately be null
      meta.actionLabel    = meta.actionLabel || null
      meta.progressTarget = Number(meta.progressTarget) || 1
    } catch {
      console.error('[/api/goal-meta] Failed to parse:', raw)
      return res.status(500).json({ error: 'Failed to parse response' })
    }

    res.status(200).json(meta)
  } catch (err) {
    console.error('[/api/goal-meta]', err)
    const isQuota = err?.status === 429
    res.status(isQuota ? 429 : 500).json({
      error: isQuota ? 'Rate limit reached — try again in a moment' : 'Failed to generate meta',
    })
  }
}
