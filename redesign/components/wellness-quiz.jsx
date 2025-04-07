"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Trophy, Award, CheckCircle2, X, Check } from "lucide-react"

const quizQuestions = [
  {
    id: 1,
    question: "Which ASU resource offers free counseling services to students?",
    options: ["ASU Bookstore", "ASU Counseling Services", "ASU Dining Hall", "ASU Recreation Center"],
    correctAnswer: "ASU Counseling Services",
  },
  {
    id: 2,
    question: "How many hours of sleep are recommended for college students?",
    options: ["4-5 hours", "6-7 hours", "7-9 hours", "10-12 hours"],
    correctAnswer: "7-9 hours",
  },
  {
    id: 3,
    question: "Which of these is a recommended stress management technique?",
    options: ["Consuming caffeine", "Skipping meals to study", "Deep breathing exercises", "Pulling all-nighters"],
    correctAnswer: "Deep breathing exercises",
  },
  {
    id: 4,
    question: "Where can ASU students access free fitness classes?",
    options: ["ASU Sun Devil Fitness Complex", "Memorial Union", "Hayden Library", "Student Services Building"],
    correctAnswer: "ASU Sun Devil Fitness Complex",
  },
  {
    id: 5,
    question: "Which ASU resource can help with time management skills?",
    options: ["First-Year Success Center", "ASU Bookstore", "Sun Devil Dining", "University Housing"],
    correctAnswer: "First-Year Success Center",
  },
]

export default function WellnessQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return // Prevent changing answer during feedback

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer,
    })
  }

  const handleCheckAnswer = () => {
    setShowFeedback(true)

    // Update answered questions count for progress bar
    if (answeredQuestions <= currentQuestion) {
      setAnsweredQuestions(currentQuestion + 1)
    }

    // Check if answer is correct and update score
    if (selectedAnswers[currentQuestion] === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 10)
    }
  }

  const handleNext = () => {
    setShowFeedback(false)

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setQuizCompleted(true)
      setShowResults(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setScore(0)
    setQuizCompleted(false)
    setShowResults(false)
    setShowFeedback(false)
    setAnsweredQuestions(0)
  }

  const progressPercentage = (answeredQuestions / quizQuestions.length) * 100
  const isCorrect = selectedAnswers[currentQuestion] === quizQuestions[currentQuestion].correctAnswer

  return (
    <div className="space-y-4">
      {!showResults ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium text-emerald-700">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </div>
            <div className="text-sm font-medium text-fuchsia-700">Score: {score} points</div>
          </div>

          <Progress value={progressPercentage} className="h-2 bg-gray-200" />

          <div className="py-4">
            <h3 className="text-lg font-medium mb-4">{quizQuestions[currentQuestion].question}</h3>

            <RadioGroup
              value={selectedAnswers[currentQuestion] || ""}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {quizQuestions[currentQuestion].options.map((option) => {
                let optionClass = "flex items-center space-x-2 border rounded-md p-3 transition-colors"

                // Add styling based on feedback state
                if (showFeedback) {
                  if (option === quizQuestions[currentQuestion].correctAnswer) {
                    optionClass += " bg-green-100 border-green-500"
                  } else if (
                    option === selectedAnswers[currentQuestion] &&
                    option !== quizQuestions[currentQuestion].correctAnswer
                  ) {
                    optionClass += " bg-red-100 border-red-500"
                  }
                } else {
                  optionClass += " hover:bg-fuchsia-50"
                }

                return (
                  <div key={option} className={optionClass}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2 w-full">
                          <RadioGroupItem
                            value={option}
                            id={option}
                            disabled={showFeedback}
                            className="w-5 h-5 appearance-none border-2 border-gray-500 rounded-full checked:bg-fuchsia-600 checked:border-fuchsia-600 checked:ring-2 checked:ring-fuchsia-400 flex items-center justify-center"
                          />
                          <Label htmlFor={option} className="cursor-pointer flex-1">{option}</Label>
                        </div>

                      </div>

                      {showFeedback && (
                        <div className="flex-shrink-0">
                          {option === quizQuestions[currentQuestion].correctAnswer ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : option === selectedAnswers[currentQuestion] &&
                            option !== quizQuestions[currentQuestion].correctAnswer ? (
                            <X className="h-5 w-5 text-red-600" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </RadioGroup>
          </div>

          {showFeedback ? (
            <div
              className={`p-3 rounded-md mb-4 ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              <div className="flex items-center space-x-2">
                {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <X className="h-5 w-5" />}
                <p>
                  {isCorrect
                    ? "Correct! Well done."
                    : `Incorrect. The correct answer is: ${quizQuestions[currentQuestion].correctAnswer}`}
                </p>
              </div>
            </div>
          ) : null}

          <Button
            onClick={showFeedback ? handleNext : handleCheckAnswer}
            disabled={!selectedAnswers[currentQuestion]}
            className={`text-white w-full ${showFeedback ? "bg-emerald-600 hover:bg-emerald-700" : "bg-fuchsia-600 hover:bg-fuchsia-700"
              }`}
          >
            {showFeedback
              ? currentQuestion < quizQuestions.length - 1
                ? "Next Question"
                : "See Results"
              : "Check Answer"}
          </Button>
        </>
      ) : (
        <div className="text-center py-6">
          <div className="flex justify-center mb-4">
            {score >= 40 ? (
              <Trophy className="h-16 w-16 text-yellow-500" />
            ) : score >= 20 ? (
              <Award className="h-16 w-16 text-emerald-500" />
            ) : (
              <CheckCircle2 className="h-16 w-16 text-fuchsia-500" />
            )}
          </div>

          <h3 className="text-xl font-bold mb-2">Quiz Completed!</h3>
          <p className="text-lg mb-4">
            Your score: <span className="font-bold text-fuchsia-700">{score}</span> out of 50 points
          </p>

          {score >= 40 ? (
            <p className="text-emerald-700 mb-6">Excellent! You're well-informed about ASU wellness resources!</p>
          ) : score >= 20 ? (
            <p className="text-emerald-700 mb-6">Good job! You know some important wellness information.</p>
          ) : (
            <p className="text-emerald-700 mb-6">
              Thanks for participating! Learning about wellness resources is an important step.
            </p>
          )}

          <Button onClick={resetQuiz} className="bg-fuchsia-600 hover:bg-fuchsia-700">
            Take Quiz Again
          </Button>
        </div>
      )}
    </div>
  )
}

