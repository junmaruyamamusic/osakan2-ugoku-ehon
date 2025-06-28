"use client"

import { useCallback, useState } from 'react'
import { StoryViewer } from '@/components/StoryViewer'
import { ImageUpload } from '@/components/ImageUpload'
import { useStore } from '@/store/useStore'
import type { Story } from '@/types'

function generateSampleStory(): Story {
  const id = Date.now().toString()
  return {
    id,
    title: 'サンプル絵本',
    childName: 'たろう',
    createdAt: new Date(),
    pages: [
      {
        id: `${id}-1`,
        text: 'こんにちは！これはサンプルページ１です。',
        imageUrl: '/globe.svg',
        animation: 'fadeIn'
      },
      {
        id: `${id}-2`,
        text: 'ページ２では次のシーンが登場します。',
        imageUrl: '/window.svg',
        animation: 'slideLeft'
      },
      {
        id: `${id}-3`,
        text: 'おしまい。見てくれてありがとう！',
        imageUrl: '/file.svg',
        animation: 'zoom'
      }
    ]
  }
}


export default function HomePage() {
  const [storyText, setStoryText] = useState('')
  const [keywords, setKeywords] = useState('')
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null)
  const [imageProgress, setImageProgress] = useState(0)
  const [imageTotal, setImageTotal] = useState(0)
  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev, msg])
    console.log(msg)
  }, [])
  const {
    currentStory,
    setCurrentStory,
    uploadedImages,
    isGenerating,
    setIsGenerating
  } = useStore()

  const handleCreate = useCallback(() => {
    addLog('サンプルストーリーを生成します')
    const story = generateSampleStory()
    setCurrentStory(story)
  }, [setCurrentStory, addLog])

  const handleSummarize = useCallback(async () => {
    if (!keywords.trim()) {
      addLog('キーワードを入力してください')
      return
    }

    addLog('あらすじ生成リクエストを送信します')
    setIsSummarizing(true)

    let res: Response
    try {
      res = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords })
      })
    } catch (error) {
      addLog(`リクエストエラー: ${String(error)}`)
      setIsSummarizing(false)
      return
    }

    addLog(`サーバーからの応答: ${res.status}`)

    if (!res.ok) {
      try {
        const data = await res.json()
        addLog(`エラー: ${data.error || res.statusText}`)
      } catch {
        addLog('不明なエラーが発生しました')
      }
      setIsSummarizing(false)
      return
    }

    const data = await res.json()
    const scenes: string[] = data.scenes || []
    setStoryText(scenes.join('\n'))
    addLog('あらすじを生成しました')
    setIsSummarizing(false)
  }, [keywords, addLog])

  const handleGenerate = useCallback(async () => {
    if (!uploadedImages.child || !storyText.trim()) {
      addLog('画像または物語のテキストが不足しています')
      return
    }

    addLog('画像生成リクエストを送信します')
    setIsGenerating(true)

    const lines = storyText.split('\n').filter(Boolean)
    const urls: string[] = []
    setImageTotal(lines.length)
    setImageProgress(0)

    for (const [index, line] of lines.entries()) {
      const formData = new FormData()
      formData.append('image', uploadedImages.child)
      formData.append('story', line)

      let res: Response
      try {
        res = await fetch('/api/generate-images', {
          method: 'POST',
          body: formData
        })
      } catch (error) {
        addLog(`リクエストエラー: ${String(error)}`)
        setIsGenerating(false)
        return
      }

      addLog(`サーバーからの応答: ${res.status}`)

      if (!res.ok) {
        try {
          const data = await res.json()
          addLog(`エラー: ${data.error || res.statusText}`)
        } catch {
          addLog('不明なエラーが発生しました')
        }
        setIsGenerating(false)
        return
      }

      const data = await res.json()
      if (data.url) {
        urls.push(data.url)
        setImageProgress(index + 1)
      }
    }
    setImageProgress(lines.length)

    const id = Date.now().toString()
    const pages = lines.map((text, i) => ({
      id: `${id}-${i}`,
      text,
      imageUrl: urls[i],
      animation: 'fadeIn' as const
    }))

    const story: Story = {
      id,
      title: 'AI絵本',
      childName: 'child',
      createdAt: new Date(),
      pages
    }

    setGeneratedStory(story)
    setIsGenerating(false)
  }, [uploadedImages.child, storyText, setIsGenerating, addLog])

  if (currentStory) {
    return <StoryViewer className="h-screen" />
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-100 p-6">
      <h1 className="mb-4 text-4xl font-bold text-pink-600 font-[var(--font-rounded)]">
        わくわくえほんパラダイス
      </h1>
      <p className="mb-6 text-center text-lg text-pink-700">
        かわいいイラストと楽しいアニメーションでオリジナル絵本を作ろう！
      </p>

      <div className="mb-4 w-full max-w-md">
        <ImageUpload type="child" />
      </div>

      <input
        type="text"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder="キーワードを入力"
        className="mb-3 w-full max-w-md rounded-lg border p-2"
      />
      <button
        onClick={handleSummarize}
        disabled={isSummarizing}
        className="mb-4 rounded-md bg-emerald-400 px-4 py-2 text-sm text-white disabled:opacity-60"
      >
        {isSummarizing ? '生成中...' : 'あらすじ生成'}
      </button>

      <textarea
        value={storyText}
        onChange={(e) => setStoryText(e.target.value)}
        rows={3}
        placeholder="3つのシーンのあらすじが表示されます"
        className="mb-4 w-full max-w-md rounded-lg border p-2"
      />

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="mb-6 rounded-lg bg-purple-500 px-6 py-3 text-lg text-white disabled:opacity-60"
      >
        {isGenerating
          ? `生成中... (${imageProgress}/${imageTotal})`
          : '絵本を生成'}
      </button>

      <div className="mb-8">
        <button
          onClick={handleCreate}
          className="rounded-md bg-gray-400 px-4 py-2 text-sm text-white"
        >
          サンプルを表示
        </button>
      </div>


      {generatedStory && (
        <div className="mt-5 text-center">
          <button
            onClick={() => setCurrentStory(generatedStory)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
          >
            絵本を見る
          </button>
        </div>
      )}

      {logs.length > 0 && (
        <div className="mt-5 max-h-52 overflow-y-auto rounded-md border bg-white/60 p-3 text-xs">
          <pre className="whitespace-pre-wrap">{logs.join('\n')}</pre>
        </div>
      )}
    </div>
  )
}

