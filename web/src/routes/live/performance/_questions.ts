import shuffle from 'lodash/shuffle.js'

let _questions: string[]
let i = 0

export function loadQuestions(questions: string[]) {
  _questions = shuffle(questions)
}

export function nextQuestion() {
  const question = _questions[i]

  if (i === _questions.length) {
    i = -1
  }

  i++

  return question
}
