"use client"

import { useState, useEffect, useRef } from "react"
import { CalendarIcon, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import TherapistAvatar from "@/components/therapist-avatar"

// interface JournalEntryDetailProps {
//   entry: {
//     id: number
//     title: string
//     content: string
//     date: string
//     mood: string
//     tags: string[]
//   }
//   entries: Array<any>
//   onClose: () => void
//   getMoodColor: (mood: string) => string
//   onNavigate: (id: number) => void
// }

export default function JournalEntryDetail({
  entry,
  entries,
  onClose,
  getMoodColor,
  onNavigate,
}) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const contentRef = useRef(null)
  const [showTherapist, setShowTherapist] = useState(false)

  // Find current entry index and determine if there are previous/next entries
  const currentIndex = entries.findIndex((e) => e.id === entry.id)
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < entries.length - 1

  // Handle navigation between entries
  const navigateToPrevious = () => {
    if (hasPrevious) {
      onNavigate(entries[currentIndex - 1].id)
    }
  }

  const navigateToNext = () => {
    if (hasNext) {
      onNavigate(entries[currentIndex + 1].id)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        navigateToPrevious()
      } else if (e.key === "ArrowRight") {
        navigateToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, entries])

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100
        setScrollProgress(progress)

        // Show therapist avatar when user reaches the end of the content
        if (progress > 80 && !showTherapist) {
          setShowTherapist(true)
        }
      }
    }

    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll)
      return () => contentElement.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Delayed appearance of therapist avatar
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTherapist(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Get background pattern based on mood
  const getMoodPattern = (mood) => {
    const patterns = {
      Happy: "radial-gradient(circle at 10% 20%, rgba(255, 255, 0, 0.03) 0%, transparent 20%)",
      Sad: "radial-gradient(circle at 90% 10%, rgba(0, 0, 255, 0.03) 0%, transparent 20%)",
      Anxious:
        "repeating-linear-gradient(45deg, rgba(128, 0, 128, 0.01) 0px, rgba(128, 0, 128, 0.01) 10px, transparent 10px, transparent 20px)",
      Tired: "radial-gradient(circle at 50% 80%, rgba(255, 165, 0, 0.03) 0%, transparent 20%)",
      Grateful: "radial-gradient(circle at 80% 50%, rgba(0, 128, 128, 0.03) 0%, transparent 20%)",
      Neutral: "radial-gradient(circle at 30% 70%, rgba(128, 128, 128, 0.02) 0%, transparent 20%)",
    }

    return patterns[mood] || patterns["Neutral"]
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col rounded-xl bg-gradient-to-b from-fuchsia-50 to-emerald-50"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress bar */}
          <div className="h-1 bg-fuchsia-100 w-full">
            <div
              className="h-full bg-fuchsia-600 transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress}%` }}
            ></div>
          </div>

          {/* Header */}
          <div className="p-4 border-b border-fuchsia-200 bg-white/90 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={navigateToPrevious}
                disabled={!hasPrevious}
                className={`text-emerald-700 hover:text-fuchsia-700 hover:bg-fuchsia-100 ${!hasPrevious ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <h2 className="text-xl font-bold text-fuchsia-900">{entry.title}</h2>

              <Button
                variant="ghost"
                size="icon"
                onClick={navigateToNext}
                disabled={!hasNext}
                className={`text-emerald-700 hover:text-fuchsia-700 hover:bg-fuchsia-100 ${!hasNext ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-emerald-700 hover:text-fuchsia-700 hover:bg-fuchsia-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content area */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto"
            style={{
              background: getMoodPattern(entry.mood),
            }}
          >
            <motion.div
              className="p-8 md:p-12"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-sm text-emerald-700 mb-6">
                <CalendarIcon className="h-4 w-4" />
                <span>{entry.date}</span>
                <Badge variant="secondary" className={getMoodColor(entry.mood)}>
                  {entry.mood}
                </Badge>
              </div>

              <div className="prose prose-fuchsia max-w-none">
                {entry.content.split("\n\n").map((paragraph, idx) => (
                  <motion.p
                    key={idx}
                    className="text-emerald-800 mb-6 leading-relaxed text-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              <motion.div
                className="flex flex-wrap gap-2 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {entry.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-white/80 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                  >
                    #{tag}
                  </Badge>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Therapist avatar section */}
          <AnimatePresence>
            {showTherapist && (
              <motion.div
                className="border-t border-fuchsia-200 bg-white/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium text-fuchsia-900 mb-4">Reflections with Serene Owl</h3>
                  <TherapistAvatar entryContent={entry.content} mood={entry.mood} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

