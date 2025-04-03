import { Flame } from "lucide-react"

// interface StreakCounterProps {
//   currentStreak: number
// }

export default function StreakCounter({ currentStreak }) {
  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-2 border border-fuchsia-200 shadow-sm">
      <Flame className="h-7 w-7 text-orange-500" />
      <div className="flex flex-col">
        <span className="text-sm text-emerald-700">Current streak</span>
        <span className="font-bold text-fuchsia-900">{currentStreak} days</span>
      </div>
    </div>
  )
}

