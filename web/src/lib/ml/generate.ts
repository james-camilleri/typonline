import ml5 from 'ml5'

import dictionary from './dictionary'

let _rnn
const length = 50

async function getRnn() {
  if (_rnn) return _rnn

  // _rnn = await ml5.charRNN('/models/hemingway')
  _rnn = await ml5.charRNN('/models/ee-cummings')
  //@ts-expect-error yye
  window.rnn = _rnn
  return _rnn
}

export async function generateText(seed: string) {
  const rnn = await getRnn()
  const text = await rnn.generate({ seed, length })

  // TODO: This filtering is too extreme.
  const filtered = text.sample.split(' ').filter((word) => dictionary.has(word))

  return filtered.join(' ')
}

// Preload the neural net on import.
getRnn()
