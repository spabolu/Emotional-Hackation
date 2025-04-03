import { useEffect, useRef } from "react";
import { Flame } from "lucide-react";
import { CountUp } from "countup.js";

export default function StreakCounter() {
  const currentStreak = 41;
  const countupRef = useRef(null);
  const countElementRef = useRef(null);

  useEffect(() => {
    if (countElementRef.current && currentStreak > 0) {
      if (countupRef.current) {
        countupRef.current.update(currentStreak);
      } else {
        countupRef.current = new CountUp(
          countElementRef.current,
          currentStreak,
          {
            duration: 2,
            useEasing: true,
            easingFn: (t, b, c, d) => {
              t /= d / 2;
              if (t < 1) return (c / 2) * t * t + b;
              t--;
              return (-c / 2) * (t * (t - 2) - 1) + b;
            },
            decimalPlaces: 0,
            separator: ",",
          }
        );

        countupRef.current.start();
      }
    }
  }, [currentStreak]);

  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-2 border border-fuchsia-200 shadow-sm">
      <Flame className="h-7 w-7 text-orange-500" />
      <div className="flex flex-col">
        <span className="text-sm text-emerald-700">Current streak</span>
        <span className="font-bold text-fuchsia-900">
          <span ref={countElementRef}>0</span> days
        </span>
      </div>
    </div>
  );
}
