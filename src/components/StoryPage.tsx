"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { StoryPage as StoryPageType, AnimationType } from '@/types'
import { cn } from '@/lib/utils'

interface StoryPageProps {
  page: StoryPageType
  isActive: boolean
  className?: string
  overlayImageUrl?: string
}

const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideLeft: {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  },
  slideRight: {
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 300, opacity: 0 }
  },
  bounce: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 }
  },
  zoom: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 }
  },
  float: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 }
  }
}

export function StoryPage({ page, isActive, className, overlayImageUrl }: StoryPageProps) {
  const animation: AnimationType = page.animation ?? 'fadeIn'
  const variant = animationVariants[animation]

  if (!isActive) return null

  const getTransition = () => {
    if (animation === 'bounce') {
      return {
        duration: 0.6,
        type: "spring" as const,
        stiffness: 260,
        damping: 20
      }
    }
    if (animation === 'float') {
      return {
        duration: 0.6,
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
    return { duration: 0.6 }
  }

  return (
    <motion.div
      key={page.id}
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={getTransition()}
      className={cn(
        "flex flex-col items-center justify-center h-full p-6 text-center",
        className
      )}
    >
      {/* Illustration Area */}
      <div className="flex-1 flex items-center justify-center mb-6 w-full max-w-md">
        {page.imageUrl ? (
          <div className="relative">
            <motion.img
              src={page.imageUrl}
              alt={`Story illustration for: ${page.text}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            />
            {overlayImageUrl && (
              <motion.img
                src={overlayImageUrl}
                alt="overlay"
                className="absolute inset-0 m-auto w-full h-full object-contain pointer-events-none"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              />
            )}
          </div>
        ) : (
          <motion.div
            className="w-full h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg shadow-lg flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl">📚</span>
              </div>
              <p className="text-gray-500 text-sm">イラスト生成中...</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Text Area */}
      <motion.div
        className="w-full max-w-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
          {page.text}
        </p>
      </motion.div>
    </motion.div>
  )
}
