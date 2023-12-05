"use client"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import Question from "../components/Question"
import Answer from "../components/Answer"
import Statistics from "@/components/Statistics"
import { useCourse, useFailedCount } from "@/store/useCourse"

export default function Home() {
  const [currentMode, setCurrentMode] = useState<'question' | 'answer'>('question')
  const { currentCourse, getCurrentStatement, toNextStatement, checkCorrect, fetchCourse } = useCourse()
  const { increaseFailedCount,resetFailedCount } = useFailedCount()

  useEffect(() => {
    fetchCourse()
    setCurrentMode('question')
  }, [])
  const currentStatement = getCurrentStatement()

  const handleToNextStatement = () => {
    toNextStatement()
    setCurrentMode('question')
  }

  const handleCheckAnswer = (userInput: string) => {
    if (checkCorrect(userInput)) {
      setCurrentMode('answer')
      resetFailedCount()
    } else {
      increaseFailedCount(() => setCurrentMode('answer'))
    }
  }


  return (

    <div className="container mx-auto flex h-full flex-1 flex-col items-center justify-center pb-10 h-96">
      <div className="container relative mx-auto flex h-full flex-col items-center">
        <div className="container flex flex-grow items-center justify-center">
          <div className="container flex h-full w-full flex-col items-center justify-center">
            <div className="container flex flex-grow flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center pb-1 pt-4">
                {currentMode === "question" ? (
                  <Question
                    word={currentStatement?.chinese||"加载中..."}
                    onCheckAnswer={handleCheckAnswer}
                  ></Question>
                ) : (
                  <Answer
                    word={currentStatement?.english||""}
                    soundmark={currentStatement?.soundmark||""}
                    onToNextStatement={handleToNextStatement}
                  ></Answer>
                )}
              </div>
            </div>
          </div>
        </div>
        <Statistics />
      </div>
    </div>
  )
}


