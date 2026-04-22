/**
 * Vercel Serverless Function — /api/goal-value-alignment
 * Given a goal title and a list of user values, returns which values align
 * with the goal and a short sentence per value explaining the connection.
 *
 * POST body: { goalTitle: string, values: string[] }
 * Returns:   { alignedValues: string[], summaries: { [value]: string } }
 */

import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are a compassionate growth companion inside the Trumi app.
A user has created a goal. Given their list of personal values, decide which values
this goal genuinely supports, and write one warm sentence per aligned value explaining
the connection in second person ("you", "your").

Rules:
- Only include values that have a meaningful, honest connection to the goal.
  Do not force a connection just to include more values.
- Each summary sentence must be 1 sentence, warm, second-person, non-pressuring.
  Never use "must", "should", "you need to", or any language of obligation or failure.
- Return ONLY valid JSON. No markdown fences. No extra text.

Format:
{
  "alignedValues": ["Value1", "Value2"],
  "summaries": {
    "Value1": "One warm sentence about how this goal connects to Value1.",
    "Value2": "One warm sentence about how this goal connects to Value2."
  }
}`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { goalTitle = '', values = [] } = req.body

  if (!goalTitle.trim() || !Array.isArray(values) || values.length === 0) {
    return res.status(400).json({ error: 'goalTitle and values are required' })
  }

  const context = `Goal: "${goalTitle}"\nUser values: ${values.join(', ')}`

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: context },
      ],
      max_tokens: 400,
      temperature: 0.4,
    })

    const raw     = completion.choices[0]?.message?.content ?? '{}'
    const cleaned = raw.replace(/```json?\n?/gi, '').replace(/```/g, '').trim()

    let result
    try {
      result = JSON.parse(cleaned)
      if (!Array.isArray(result.alignedValues)) throw new Error('Missing alignedValues')
      if (typeof result.summaries !== 'object') throw new Error('Missing summaries')
    } catch {
      console.error('[/api/goal-value-alignment] Failed to parse:', raw)
      return res.status(500).json({ error: 'Failed to parse response' })
    }

    res.status(200).json(result)
  } catch (err) {
    console.error('[/api/goal-value-alignment]', err)
    const isQuota = err?.status === 429
    res.status(isQuota ? 429 : 500).json({
      error: isQuota ? 'Rate limit reached — try again in a moment' : 'Failed to generate value alignment',
    })
  }
}
