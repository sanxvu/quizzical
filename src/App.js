import React from "react"
import Quiz from "./Quiz"

export default function App() {
  const [startQuiz, setStartQuiz] = React.useState(false)

  function start() {
    setStartQuiz(true)
    console.log(startQuiz)
  }

  return (
    <div>
      {!startQuiz
        ?
        <div className="start-page">
          <h1>Quizzical</h1>
          <button className="start-button" onClick={start}>Start quiz</button>
        </div>
        :
        <Quiz />
      }

      <div className="top-blob"></div>
      <div className="bottom-blob"></div>
    </div>
  )
}