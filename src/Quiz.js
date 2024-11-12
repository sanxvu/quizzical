import React from "react"
import he from "he"
import { nanoid } from "nanoid"
import Answer from "./Answer"

export default function Quiz() {
    const [allQuestions, setAllQuestions] = React.useState([])
    const [correctAnswers, setCorrectAnswers] = React.useState(0)
    const [finish, setFinish] = React.useState(false)

    // Fetch questions from API
    async function getQuestions() {
        const res = await fetch("https://opentdb.com/api.php?amount=5")
        const data = await res.json()

        const questionsWithAnswers = data.results.map(item => {
            const answers = [
                { answer: he.decode(item.correct_answer), isCorrect: true },
                ...item.incorrect_answers.map(answer => ({
                    answer: he.decode(answer),
                    isCorrect: false,
                }))
            ];

            return {
                id: nanoid(),
                question: he.decode(item.question),
                answers: shuffleArray(answers),
                selection: ""
            }
        })
        setAllQuestions(questionsWithAnswers)
        setCorrectAnswers(0)
        setFinish(false)
    }

    React.useEffect(() => {
        getQuestions()
    }, [])

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5)
    }

    // Handle answer selection
    function selectAnswer(questionIndex, answerIndex) {
        setAllQuestions(prevAllQuestions =>
            prevAllQuestions.map((question, qIndex) => {
                if (qIndex === questionIndex) {
                    return {
                        ...question,
                        selection: answerIndex
                    }
                }
                return question
            })
        )
    }

    console.log(allQuestions)

    // Handle bottom button - when user clicks Check answers or Play again
    function bottomButton() {
        if (!finish) {
            // Check answers
            setFinish(true)
            let correctAnswers = 0
            allQuestions.map((question, index) => {
                if (!question.selection) { // edge case: did not select answers yet
                    return
                }
                // Calculate score
                const answerIndex = question.selection
                if (question.answers[answerIndex].isCorrect) {
                    correctAnswers++
                }
            })
            setCorrectAnswers(correctAnswers)
        }
        else {
            // Play again
            setFinish(false)
            getQuestions()
        }
    }

    return (
            <div className="quiz">
                {allQuestions.length > 0 ? (
                    <>
                        {allQuestions.map((question, questionIndex) => (
                            <div className="question-container">
                                <p className="question">{question.question}</p>
                                {question.answers.map((answer, answerIndex) => {
                                    let buttonClass = "unselected"
                                    if (finish) {
                                        // If finish is true, apply classes based on selection and correctness
                                        if (question.selection === answerIndex) {
                                            buttonClass = answer.isCorrect ? "correct" : "incorrect"
                                        } else {
                                            buttonClass = "faded" // Fade out all other buttons
                                        }
                                    } else if (question.selection === answerIndex) {
                                        buttonClass = "selected"
                                    }
                                    return (
                                        <button
                                            key={answerIndex}
                                            onClick={() => selectAnswer(questionIndex, answerIndex)}
                                            className={buttonClass}>
                                            {answer.answer}
                                        </button>
                                    )
                                }

                                )}
                            </div>
                        ))}
                        <div>
                            {finish && <span className="question">You scored {correctAnswers}/{allQuestions.length} correct answers</span>}
                            <button
                                className="bottom-button"
                                onClick={bottomButton}>
                                {finish ? "Play again" : "Check answers"}
                            </button>
                        </div>
                    </>
                )
                    : (
                        <p>Loading page...</p>
                    )}
            </div>
    )
}