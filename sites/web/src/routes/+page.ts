export async function load({ fetch }) {
  const url = '/api/conversations'
  const response = await fetch(url)

  return {
    conversations: await response.json(),
  }
}
