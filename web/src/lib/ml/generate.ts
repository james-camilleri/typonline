import ml5 from 'ml5'

let _rnn
const length = 40

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
  const text: { sample: string } = await rnn.generate({ seed, length })

  // Remove last word, because there's a hard character
  // and in most cases it truncates the last generated word.
  const filtered = text.sample.split(' ').slice(0, -2)

  return filtered.join(' ')
}

// Preload the neural net on import.
getRnn()
