import React from "react"

export default function Answer(props) {
    return (
        <button
            className={props.isSelected ? "selected" : "unselected"}
            onClick={props.handleSelectAnswer(props.questionIndex, props.answerIndex)}>
            {props.answer}
        </button>
    )
}