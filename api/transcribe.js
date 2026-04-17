/**
 * Vercel Serverless Function — /api/transcribe
 * Converts audio to text using Groq's Whisper implementation.
 *
 * POST body: { audio: string (base64), mimeType: string }
 * Returns:   { text: string }
 */

import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { audio, mimeType = 'audio/webm' } = req.body

  if (!audio) {
    return res.status(400).json({ error: 'No audio data provided' })
  }

  try {
    const buffer = Buffer.from(audio, 'base64')
    const file   = new File([buffer], 'recording.webm', { type: mimeType })

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: 'whisper-large-v3-turbo',
      response_format: 'json',
      language: 'en',
    })

    const text = transcription.text?.trim() ?? ''

    if (!text) {
      return res.status(200).json({ text: '' })
    }

    res.status(200).json({ text })
  } catch (err) {
    console.error('[/api/transcribe]', err)
    res.status(500).json({ error: 'Transcription failed — please try again' })
  }
}
