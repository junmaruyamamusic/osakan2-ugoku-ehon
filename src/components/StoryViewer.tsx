"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { StoryPage } from '@/components/StoryPage'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import { createCompositeImage } from '@/lib/image'

interface StoryViewerProps {
  className?: string
}

export function StoryViewer({ className }: StoryViewerProps) {
  const {
    currentStory,
    currentPageIndex,
    nextPage,
    previousPage,
    setCurrentStory,
    uploadedImages
  } = useStore()

  const [childImageUrl, setChildImageUrl] = React.useState<string>()

  React.useEffect(() => {
    let cancelled = false
    if (!uploadedImages.child) {
      setChildImageUrl(undefined)
      return
    }
    createCompositeImage(uploadedImages.child)
      .then((url) => {
        if (!cancelled) setChildImageUrl(url)
      })
      .catch(() => setChildImageUrl(undefined))
    return () => {
      cancelled = true
    }
  }, [uploadedImages.child])

  if (!currentStory) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">物語が選択されていません</p>
      </div>
    )
  }

  const progress = ((currentPageIndex + 1) / currentStory.pages.length) * 100
  const canGoNext = currentPageIndex < currentStory.pages.length - 1
  const canGoPrevious = currentPageIndex > 0

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight' && canGoNext) {
      nextPage()
    } else if (event.key === 'ArrowLeft' && canGoPrevious) {
      previousPage()
    }
  }

  return (
    <div 
      className={cn("flex flex-col h-full bg-gradient-to-br from-blue-50 to-purple-50", className)}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentStory(null)}
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          ホーム
        </Button>
        
        <div className="flex-1 mx-4">
          <h1 className="text-lg font-semibold text-center text-gray-800 mb-2">
            {currentStory.title}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 min-w-fit">
              {currentPageIndex + 1} / {currentStory.pages.length}
            </span>
            <Progress value={progress} className="flex-1" />
          </div>
        </div>

        <div className="w-16" /> {/* Spacer for balance */}
      </div>

      {/* Story Content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <StoryPage
            key={currentPageIndex}
            page={currentStory.pages[currentPageIndex]}
            isActive={true}
            className="absolute inset-0"
            childImageUrl={childImageUrl}
          />
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-t">
        <Button
          variant="outline"
          size="lg"
          onClick={previousPage}
          disabled={!canGoPrevious}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          前へ
        </Button>

        <div className="flex gap-2">
          {currentStory.pages.map((_, index) => (
            <motion.div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentPageIndex ? "bg-blue-500" : "bg-gray-300"
              )}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={nextPage}
          disabled={!canGoNext}
          className="flex items-center gap-2"
        >
          次へ
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
