export default function MoodCalendar() {
  // This is a simplified calendar view
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Mock data for mood entries
  const moodEntries = {
    3: "happy",
    7: "sad",
    12: "neutral",
    15: "excited",
    18: "anxious",
    21: "relaxed",
    25: "tired",
    28: "grateful",
  }

  const getMoodColor = (mood) => {
    switch (mood) {
      case "happy":
        return "bg-yellow-200 border-yellow-400"
      case "sad":
        return "bg-blue-200 border-blue-400"
      case "neutral":
        return "bg-gray-200 border-gray-400"
      case "excited":
        return "bg-pink-200 border-pink-400"
      case "anxious":
        return "bg-purple-200 border-purple-400"
      case "relaxed":
        return "bg-green-200 border-green-400"
      case "tired":
        return "bg-orange-200 border-orange-400"
      case "grateful":
        return "bg-teal-200 border-teal-400"
      default:
        return "bg-white border-fuchsia-200"
    }
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-emerald-700">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const mood = moodEntries[day]
          return (
            <div
              key={day}
              className={`aspect-square flex items-center justify-center rounded-md border ${
                mood ? getMoodColor(mood) : "bg-white/60 border-fuchsia-200"
              } text-xs font-medium ${mood ? "text-gray-800" : "text-emerald-800"} hover:border-fuchsia-400 transition-colors cursor-pointer`}
            >
              {day}
            </div>
          )
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1">
        {Object.values(moodEntries)
          .filter((value, index, self) => self.indexOf(value) === index)
          .map((mood) => (
            <div key={mood} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getMoodColor(mood)}`}></div>
              <span className="text-xs text-emerald-800 capitalize">{mood}</span>
            </div>
          ))}
      </div>
    </div>
  )
}
