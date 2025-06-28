import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const image = formData.get('image') as File | null
  const story = formData.get('story') as string | null

  if (!image || !story) {
    return NextResponse.json({ error: 'Missing image or story' }, { status: 400 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
  }

  const openai = new OpenAI({ apiKey })

  const prompt = `${story}\nIllustrate this scene for a children's picture book. The main character should resemble the uploaded child photo. Place the protagonist's face at the center of the image.`

  try {
    const res = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '512x512'
    })

    const url = res.data?.[0]?.url

    return NextResponse.json({ url })
  } catch (error) {
    console.error('generate-images error:', error)
    if (error instanceof OpenAI.APIError) {
      const message = error.error?.message || error.message
      return NextResponse.json({ error: message }, { status: error.status })
    }
    const message = error instanceof Error ? error.message : 'Failed to generate images'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
