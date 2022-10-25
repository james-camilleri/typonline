import shuffle from 'lodash/shuffle.js'
import { Configuration, OpenAIApi } from 'openai'

import poemSeeds from './_seeds'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
  try {
    const payload = await request.json()
    const { seeds } = payload
    const seedPoem = shuffle(poemSeeds.flat()).slice(0, 20).join('\n')
    const prompt = `${seedPoem}\n\nwrite a poem using the words ${seeds.join(
      ', ',
    )} in the style of e e cummings:`
    console.log(prompt)

    const response = await openai.createCompletion({
      prompt,
      model: 'text-davinci-002',
      temperature: 0.6,
      max_tokens: 150,
      top_p: 0.8,
      best_of: 3,
      frequency_penalty: 1.7,
      presence_penalty: 1.5,
    })

    const poem = response.data.choices[0].text
      .split('\n')
      .filter((line) => !line.startsWith(','))
      .join('\n')

    return {
      status: response.status,
      body: {
        poem,
      },
    }
  } catch (e) {
    return {
      status: 500,
      body: e.message,
    }
  }
}
