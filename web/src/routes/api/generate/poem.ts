import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
  try {
    const payload = await request.json()
    const { seeds } = payload
    const prompt = `a poem with the words ${seeds.join(', ')}`

    const response = await openai.createCompletion({
      prompt,
      model: 'text-davinci-002',
      temperature: 0.8,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
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
