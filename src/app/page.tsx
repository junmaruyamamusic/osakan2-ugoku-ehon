"use client"

import { useCallback, useState } from 'react'
import { StoryViewer } from '@/components/StoryViewer'
import { ImageUpload } from '@/components/ImageUpload'
import { useStore } from '@/store/useStore'
import type { Story } from '@/types'
import { createCompositeImage } from '@/lib/image'

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
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null)
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null)
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
    setStoryText(data.summary || '')
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
    const formData = new FormData()
    formData.append('image', uploadedImages.child)
    formData.append('story', storyText)

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
    const urls: string[] = data.urls || []
    const lines = storyText.split('\n').filter(Boolean)
    const id = Date.now().toString()
    const pages = urls.map((url, i) => ({
      id: `${id}-${i}`,
      text: lines[i] || '',
      imageUrl: url,
      animation: 'fadeIn' as const
    }))

    const story: Story = {
      id,
      title: 'AI絵本',
      childName: 'child',
      createdAt: new Date(),
      pages
    }

    let preview: string | null = null
    if (uploadedImages.child) {
      try {
        preview = await createCompositeImage(uploadedImages.child)
        setCroppedUrl(preview)
      } catch (e) {
        console.error('crop error', e)
      }
    }

    setGeneratedStory(story)
    setIsGenerating(false)
  }, [uploadedImages.child, storyText, setIsGenerating, addLog])

  if (currentStory) {
    return <StoryViewer className="h-screen" />
  }

  return (
    <div
      style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}
    >
      <h1 style={{ color: '#333', fontSize: '32px', marginBottom: '20px' }}>
        動く絵本アプリ
      </h1>
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '20px' }}>
        子ども向けの動きのあるイラスト付き絵本をWebアプリとして提供するサービスです。
      </p>

      <div style={{ marginBottom: '20px' }}>
        <ImageUpload type="child" />
      </div>

      <input
        type="text"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder="キーワードを入力"
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '12px',
          borderRadius: '6px'
        }}
      />
      <button
        onClick={handleSummarize}
        disabled={isSummarizing}
        style={{
          backgroundColor: '#34D399',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer',
          opacity: isSummarizing ? 0.6 : 1,
          marginBottom: '20px'
        }}
      >
        {isSummarizing ? '生成中...' : 'あらすじ生成'}
      </button>

      <textarea
        value={storyText}
        onChange={(e) => setStoryText(e.target.value)}
        rows={1}
        placeholder="1行の物語を入力してください"
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '20px',
          borderRadius: '6px'
        }}
      />

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        style={{
          backgroundColor: '#8B5CF6',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          opacity: isGenerating ? 0.6 : 1
        }}
      >
        {isGenerating ? '生成中...' : '絵本を生成'}
      </button>

      <div style={{ marginTop: '40px' }}>
        <button
          onClick={handleCreate}
          style={{
            backgroundColor: '#aaa',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          サンプルを表示
        </button>
      </div>

      {croppedUrl && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <img
            src={croppedUrl}
            alt="preview"
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'contain',
              marginBottom: '12px'
            }}
          />
          {generatedStory && (
            <button
              onClick={() => setCurrentStory(generatedStory)}
              style={{
                backgroundColor: '#2563EB',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              絵本を見る
            </button>
          )}
        </div>
      )}

      {logs.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '10px',
            maxHeight: '200px',
            overflowY: 'auto',
            fontSize: '12px'
          }}
        >
          <pre style={{ whiteSpace: 'pre-wrap' }}>{logs.join('\n')}</pre>
        </div>
      )}
    </div>
  )
}

